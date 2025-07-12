// @/controllers/auth/resetPassword.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { sendEmailVerification } from '@/services/emailService'

const prisma = new PrismaClient()

// ขอ reset password (ส่งลิงก์ไปอีเมล)
export async function requestReset(req: Request, res: Response) {
  const { email } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ message: 'User not found' })

  const token = uuidv4()
  const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 ชั่วโมง

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry
    }
  })

  await sendEmailVerification(email, token)
  res.json({ message: 'Reset link sent to your email' })
}

// เปลี่ยนรหัสผ่าน
export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date() // ตรวจสอบว่ายังไม่หมดอายุ
      }
    }
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' })
  }

  const hashed = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  res.json({ message: 'Password updated successfully' })
}
