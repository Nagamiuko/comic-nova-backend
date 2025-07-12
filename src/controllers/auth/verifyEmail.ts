// @/controllers/auth/verifyEmail.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function verifyEmail(req: Request, res: Response): Promise<any> {
  const token = req.query.token as string

  console.log(token);


  if (!token) {
    return res.status(400).json({ message: 'Token is required' })
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null
    }
  })

  return res.json({ message: 'Email verified successfully!' })
}
