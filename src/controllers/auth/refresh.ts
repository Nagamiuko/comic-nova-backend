// @/controllers/auth/refresh.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' })
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    // ตรวจสอบว่ามีในฐานข้อมูล และไม่หมดอายุ
    if (
      !storedToken ||
      storedToken.expiresAt.getTime() < Date.now()
    ) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' })
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    res.json({ accessToken: newAccessToken })
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}
