"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = verifyEmail;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function verifyEmail(req, res) {
    const token = req.query.token;
    console.log(token);
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    const user = await prisma.user.findFirst({
        where: { verificationToken: token }
    });
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationToken: null
        }
    });
    return res.json({ message: 'Email verified successfully!' });
}
