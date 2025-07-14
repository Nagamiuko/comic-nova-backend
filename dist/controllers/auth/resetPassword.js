"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestReset = requestReset;
exports.resetPassword = resetPassword;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const emailService_1 = require("@/services/emailService");
const prisma = new client_1.PrismaClient();
// ขอ reset password (ส่งลิงก์ไปอีเมล)
async function requestReset(req, res) {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    const token = (0, uuid_1.v4)();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 ชั่วโมง
    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry
        }
    });
    await (0, emailService_1.sendEmailVerification)(email, token);
    res.json({ message: 'Reset link sent to your email' });
}
// เปลี่ยนรหัสผ่าน
async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gte: new Date() // ตรวจสอบว่ายังไม่หมดอายุ
            }
        }
    });
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    const hashed = await bcrypt_1.default.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashed,
            resetToken: null,
            resetTokenExpiry: null
        }
    });
    res.json({ message: 'Password updated successfully' });
}
