// @/controllers/auth/login.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateRefreshToken, sendToken } from "@/utils/token";

const prisma = new PrismaClient();

export async function login(req: Request, res: Response): Promise<any> {
  const { email, password } = req.body;
  try {
    // ค้นหาผู้ใช้จากตาราง User พร้อมโหลด Profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, refreshTokens: true },
    });

    // ตรวจสอบว่า user มีอยู่หรือไม่ และรหัสผ่านตรงหรือไม่
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ตรวจสอบอีเมลยืนยันแล้วหรือยัง
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email" });
    }

    // สร้าง access / refresh token

    const refreshToken = generateRefreshToken(user.id);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
      },
    });
    return sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
  }
}
