"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEpisode = addEpisode;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const cloudr2_1 = require("@/utils/cloudr2");
const prisma = new client_1.PrismaClient();
async function addEpisode(req, res) {
    const { title, type, coinCost } = req.body;
    const files = req.files;
    const { comicId, userId } = req.query;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    if (!comicId || !title || !files || files.length === 0)
        return res.status(400).json({ message: "Missing required fields" });
    try {
        // ตรวจสอบว่า user เป็นเจ้าของ comic จริงไหม
        const comic = await prisma.comic.findUnique({
            where: { id: comicId },
            include: { author: true },
        });
        if (!comic)
            return res.status(404).json({ message: "Comic not found" });
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile || profile.id !== comic.authorId)
            return res.status(403).json({ message: "Forbidden" });
        // หาหมายเลขตอนล่าสุด
        const lastEpisode = await prisma.episode.findFirst({
            where: { comicId },
            orderBy: { episodeNumber: "desc" },
        });
        const episodeNumber = (lastEpisode?.episodeNumber || 0) + 1;
        // อัปโหลดภาพทั้งหมด แล้วเก็บ URL พร้อม order
        const imageData = [];
        await Promise.all(files.map(async (file, index) => {
            const fileExt = path_1.default.extname(file.originalname) || ".jpg";
            const fileKey = `episodes/${comicId}/${episodeNumber}/${(0, uuid_1.v4)()}${fileExt}`;
            const upload = (0, cloudr2_1.uploadParams)(file, fileKey);
            await cloudr2_1.clients3.send(new client_s3_1.PutObjectCommand(upload));
            const url = `https://pub-ba5965ac0d8a4e23b9781b3defa3c6d1.r2.dev/${upload.Bucket}/${upload.Key}`;
            imageData.push({ imageUrl: url, order: index + 1 });
        }));
        // สร้าง Episode และ EpisodeImage
        const newEpisode = await prisma.episode.create({
            data: {
                comicId,
                title,
                episodeNumber,
                type: type === "premium" ? client_1.EpisodeType.premium : client_1.EpisodeType.free,
                coinCost: type === "premium" ? parseInt(coinCost) || 1 : 0,
                contentImages: {
                    create: imageData,
                },
            },
            include: {
                contentImages: true,
            },
        });
        res.status(201).json({ message: "Episode created", episode: newEpisode });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add episode" });
    }
}
