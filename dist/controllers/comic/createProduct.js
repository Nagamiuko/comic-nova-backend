"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComic = createComic;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const cloudr2_1 = require("@/utils/cloudr2");
const prisma = new client_1.PrismaClient();
async function createComic(req, res) {
    const { title, description, tags, status, categoryId } = req.body;
    const { userId } = req.query;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    if (!title)
        return res.status(400).json({ message: "Title is required" });
    const files = req.files;
    if (!files || files.length === 0)
        return res.status(400).json({ message: "No files uploaded" });
    try {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            return res.status(404).json({ message: "Profile not found" });
        const result = {
            "1080x1920": [],
            "1080x1080": [],
            others: [],
        };
        console.log(result);
        await Promise.all(files.map(async (file) => {
            const buffer = file.buffer || fs_1.default.readFileSync(file.path);
            const image = (0, sharp_1.default)(buffer);
            const metadata = await image.metadata();
            let folder = "others";
            if (metadata.width === 1080 && metadata.height === 1920)
                folder = "1080x1920";
            if (metadata.width === 1080 && metadata.height === 1080)
                folder = "1080x1080";
            const fileExt = path_1.default.extname(file.originalname) || ".jpg";
            const fileKey = `folder/${folder}/${(0, uuid_1.v4)()}${fileExt}`;
            const up = (0, cloudr2_1.uploadParams)(file, fileKey);
            await cloudr2_1.clients3.send(new client_s3_1.PutObjectCommand(up));
            const publicUrl = `https://pub-ba5965ac0d8a4e23b9781b3defa3c6d1.r2.dev/comic-nova/${up.Key}`;
            result[folder].push(publicUrl);
        }));
        if (categoryId) {
            await prisma.categories.update({
                where: { id: categoryId },
                data: { count: { increment: 1 } },
            });
        }
        const comic = await prisma.comic.create({
            data: {
                title,
                description,
                coverUrl1: result["1080x1080"].length > 0
                    ? result["1080x1080"]
                    : result["others"],
                coverUrl2: result["1080x1920"].length > 0
                    ? result["1080x1920"]
                    : result["others"],
                tags: tags ? JSON.parse(tags) : [],
                status: status || client_1.ComicStatus.ongoing,
                author: { connect: { id: profile.id } },
                categorie: categoryId ? { connect: [{ id: categoryId }] } : undefined,
            },
            include: {
                categorie: true,
            },
        });
        return res
            .status(201)
            .json({ message: "Upload comic successful", data: comic });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create comic" });
    }
}
