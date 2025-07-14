"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailVerification = sendEmailVerification;
// @/services/emailService.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
    }
});
async function sendEmailVerification(email, token) {
    const html = fs_1.default.readFileSync(__dirname + '/../templates/verify-email.html', 'utf8')
        .replace('{{username}}', 'ผู้ใช้งาน')
        .replace('{{verifyUrl}}', `${process.env.CLIENT_URL}/verify-email?token=${token}`);
    await transporter.sendMail({
        from: `"ComicNova" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'ยืนยันอีเมลของคุณ',
        html
    });
}
