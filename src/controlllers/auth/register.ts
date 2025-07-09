// @/controllers/auth/register.ts
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { sendEmailVerification } from '@/services/emailService'

const prisma = new PrismaClient()

export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body

  // ตรวจสอบว่า email มีอยู่แล้วใน user หรือยัง
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' })
  }

  // Hash รหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10)
  const verificationToken = uuidv4()

  try {
    // สร้าง User + Profile
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        profile: {
          create: {
            username,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    // ส่งอีเมลยืนยัน
    await sendEmailVerification(email, verificationToken)

    return res.status(201).json({ message: 'Registered successfully. Please verify your email.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Registration failed' })
  }
}
