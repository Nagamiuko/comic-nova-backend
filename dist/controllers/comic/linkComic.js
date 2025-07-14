"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeComic = unlikeComic;
exports.likeComic = likeComic;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function unlikeComic(req, res) {
    const { comicId } = req.body;
    const userId = req.userId;
    try {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            return res.status(404).json({ message: "User not found" });
        const existing = await prisma.like.findUnique({
            where: {
                profileId_comicId: {
                    profileId: profile.id,
                    comicId,
                },
            },
        });
        if (!existing) {
            return res.status(400).json({ message: "You have not liked this comic" });
        }
        await prisma.like.delete({
            where: {
                profileId_comicId: {
                    profileId: profile.id,
                    comicId,
                },
            },
        });
        // อัปเดตจำนวนไลก์
        const totalLikes = await prisma.like.count({ where: { comicId } });
        return res.json({ message: "Unliked", totalLikes });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to unlike comic" });
    }
}
async function likeComic(req, res) {
    const { comicId } = req.body;
    const userId = req.userId;
    try {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            return res.status(404).json({ message: "User not found" });
        // ตรวจสอบว่ากดถูกใจอยู่แล้วหรือยัง
        const existing = await prisma.like.findUnique({
            where: {
                profileId_comicId: {
                    profileId: profile.id,
                    comicId,
                },
            },
        });
        if (existing) {
            return res.status(400).json({ message: "You already liked this comic" });
        }
        await prisma.like.create({
            data: {
                profileId: profile.id,
                comicId,
            },
        });
        // อัปเดตจำนวนไลก์
        const totalLikes = await prisma.like.count({ where: { comicId } });
        return res.json({ message: "Liked", totalLikes });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to like comic" });
    }
}
