import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type FolderKey = "1080x1920" | "1080x1080" | "others";

interface KeyId {
  comicId?: string;
  userId?: string;
}

export async function unlikeComic(req: Request, res: Response): Promise<any> {
  const { comicId } = req.body;
  const userId = (req as any).userId;

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "User not found" });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unlike comic" });
  }
}

export async function likeComic(req: Request, res: Response): Promise<any> {
  const { comicId } = req.body;
  const userId = (req as any).userId;

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "User not found" });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like comic" });
  }
}
