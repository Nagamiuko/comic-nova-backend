"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const emailService_1 = require("@/services/emailService");
const prisma = new client_1.PrismaClient();
async function register(req, res) {
    const { email, password, username } = req.body;
    console.log(username);
    // ตรวจสอบว่า email มีอยู่แล้วใน user หรือยัง
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const verificationToken = (0, uuid_1.v4)();
    try {
        // สร้าง User + Profile
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verificationToken,
                profile: {
                    create: {
                        username: username,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        // ส่งอีเมลยืนยัน
        await (0, emailService_1.sendEmailVerification)(email, verificationToken);
        return res.status(201).json({ message: 'Registered successfully. Please verify your email.' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Registration failed' });
    }
}
