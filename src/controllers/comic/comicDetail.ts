// @/controllers/comic/comicDetail.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function comicDetail(req: Request, res: Response): Promise<any> {
  const { comicId } = req.query;

  if (!comicId || typeof comicId !== "string") {
    return res.status(400).json({ message: "comicId is required" });
  }

  try {
    const comic = await prisma.comic.findUnique({
      where: { id: comicId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        episodes: {
          select: {
            id: true,
            title: true,
            episodeNumber: true,
            type: true,
            coinCost: true,
            createdAt: true,
          },
          orderBy: {
            episodeNumber: "asc",
          },
        },
        comments: {
          select: {
            id: true,
            profileId: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            parentId: true,
            content: true,
            replies: {
              select: {
                id: true,
                profileId: true,
                profile: {
                  select: {
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
                content: true,
                parentId: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    if (!comic) {
      return res.status(404).json({ message: "Comic not found" });
    }

    return res.json(comic);
  } catch (error) {
    console.error("comicDetail error:", error);
    return res.status(500).json({ message: "Failed to fetch comic detail" });
  }
}
