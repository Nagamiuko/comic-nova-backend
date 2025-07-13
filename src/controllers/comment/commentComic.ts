// @/controllers/comment/commmentComic.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface KeyId {
  comicId?: string;
  userId?: string;
}
export async function commentComic(req: Request, res: Response): Promise<any> {
  const { content, parentId } = req.body;
  const { comicId, userId }: KeyId = req.query;

  if (!userId || !comicId || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "User not found" });

    // const episode = await prisma.episode.findFirst({ where: { comicId } });
    // if (!episode) return res.status(404).json({ message: "Episode not found" });

    const comment = await prisma.comment.create({
      data: {
        profileId: profile.id,
        comicId,
        content,
        parentId: parentId || null,
      },
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to comment" });
  }
}

export async function replyComment(req: Request, res: Response): Promise<any> {
  const { content, parentId } = req.body;
  const { comicId, userId }: { comicId?: string; userId?: string } =
    req.query as any;

  if (!userId || !comicId || !parentId || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "User not found" });
    // ตรวจสอบ parent comment ว่ามีจริงไหม
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    // สร้าง reply comment
    const reply = await prisma.comment.create({
      data: {
        profileId: profile.id,
        comicId,
        content,
        parentId,
      },
      include: {
        profile: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.status(201).json({ message: "Reply created", reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to reply to comment" });
  }
}
