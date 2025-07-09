// @/services/emailService.ts
import nodemailer from 'nodemailer'
import fs from 'fs'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
})

export async function sendEmailVerification(email: string, token: string) {
  const html = fs.readFileSync(__dirname + '/../templates/verify-email.html', 'utf8')
    .replace('{{username}}', 'ผู้ใช้งาน')
    .replace('{{verifyUrl}}', `${process.env.CLIENT_URL}/verify-email?token=${token}`)

  await transporter.sendMail({
    from: `"ComicNova" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'ยืนยันอีเมลของคุณ',
    html
  })
}
