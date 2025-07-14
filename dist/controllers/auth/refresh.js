"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = refresh;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
async function refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        // ตรวจสอบว่ามีในฐานข้อมูล และไม่หมดอายุ
        if (!storedToken ||
            storedToken.expiresAt.getTime() < Date.now()) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}
