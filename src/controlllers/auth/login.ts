// @/controllers/auth/login.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/utils/token'

const prisma = new PrismaClient()

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  // ค้นหาผู้ใช้จากตาราง User พร้อมโหลด Profile
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  })

  // ตรวจสอบว่า user มีอยู่หรือไม่ และรหัสผ่านตรงหรือไม่
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  // ตรวจสอบอีเมลยืนยันแล้วหรือยัง
  if (!user.isVerified) {
    return res.status(403).json({ message: 'Please verify your email' })
  }

  // สร้าง access / refresh token
  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  // บันทึก refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
    },
  })

  return res.status(200).json({
    accessToken,
    refreshToken,
    profile: user.profile,
  })
}
