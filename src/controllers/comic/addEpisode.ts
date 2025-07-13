import { Request, Response } from "express";
import { EpisodeType, PrismaClient } from "@prisma/client";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { clients3, uploadParams } from "@/utils/cloudr2";
const prisma = new PrismaClient();

type FolderKey = "1080x1920" | "1080x1080" | "others";

interface KeyId {
  comicId?: string;
  userId?: string;
}

export async function addEpisode(req: Request, res: Response): Promise<any> {
  const { title, type, coinCost } = req.body;
  const files = req.files as Express.Multer.File[];
  const { comicId, userId }: KeyId = req.query as any;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!comicId || !title || !files || files.length === 0)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    // ตรวจสอบว่า user เป็นเจ้าของ comic จริงไหม
    const comic = await prisma.comic.findUnique({
      where: { id: comicId },
      include: { author: true },
    });

    if (!comic) return res.status(404).json({ message: "Comic not found" });

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
    const imageData: { imageUrl: string; order: number }[] = [];

    await Promise.all(
      files.map(async (file, index) => {
        const fileExt = path.extname(file.originalname) || ".jpg";
        const fileKey = `episodes/${comicId}/${episodeNumber}/${uuidv4()}${fileExt}`;
        const upload = uploadParams(file, fileKey);
        await clients3.send(new PutObjectCommand(upload));
        const url = `https://pub-ba5965ac0d8a4e23b9781b3defa3c6d1.r2.dev/${upload.Bucket}/${upload.Key}`;
        imageData.push({ imageUrl: url, order: index + 1 });
      })
    );

    // สร้าง Episode และ EpisodeImage
    const newEpisode = await prisma.episode.create({
      data: {
        comicId,
        title,
        episodeNumber,
        type: type === "premium" ? EpisodeType.premium : EpisodeType.free,
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add episode" });
  }
}
