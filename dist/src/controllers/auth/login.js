"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("@/utils/token");
const prisma = new client_1.PrismaClient();
async function login(req, res) {
    const { email, password } = req.body;
    // ค้นหาผู้ใช้จากตาราง User พร้อมโหลด Profile
    const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
    });
    // ตรวจสอบว่า user มีอยู่หรือไม่ และรหัสผ่านตรงหรือไม่
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    // ตรวจสอบอีเมลยืนยันแล้วหรือยัง
    if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email' });
    }
    // สร้าง access / refresh token
    const accessToken = (0, token_1.generateAccessToken)(user.id);
    const refreshToken = (0, token_1.generateRefreshToken)(user.id);
    // บันทึก refresh token
    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
        },
    });
    return (0, token_1.sendToken)(user, 200, res);
}
