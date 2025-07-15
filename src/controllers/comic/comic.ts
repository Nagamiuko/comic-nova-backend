import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { truncate, truncateSync } from "fs";

const prisma = new PrismaClient();

type FolderKey = "1080x1920" | "1080x1080" | "others";

interface KeyId {
  comicId?: string;
  userId?: string;
}

export async function getComics(req: Request, res: Response): Promise<any> {
  try {
    const comic = await prisma.comic.findMany({
      select: {
        id: true,
        description: true,
        coverUrl1: true,
        coverUrl2: true,
        status: true,
        tags: true,
        updatedAt:true,
        createdAt:true,
        episodes: {
          select: {
            comicId: true,
            id: true,
            title: true,
            episodeNumber: true,
            type: true,
            coinCost: true,
            createdAt: true,
          },
          orderBy: {
            updatedAt: "desc",
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
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });
    res.status(201).json({ message: "Fetch comics successful ", data: comic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function updateViewComic(req: Request, res: Response) {
  const { comicId } = req.body;

  try {
    const updated = await prisma.comic.update({
      where: { id: comicId },
      data: {
        viewCount: { increment: 1 },
      },
    });

    res.json({ message: "View updated", viewCount: updated.viewCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update view" });
  }
}

export async function bookmarkComic(req: Request, res: Response) {
  const { comicId } = req.body;
  const userId = (req as any).userId;

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "User not found" });

    const existing = await prisma.bookmark.findUnique({
      where: { profileId_comicId: { profileId: profile.id, comicId } },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { profileId_comicId: { profileId: profile.id, comicId } },
      });
      return res.json({ message: "Removed bookmark" });
    } else {
      await prisma.bookmark.create({
        data: {
          profileId: profile.id,
          comicId,
        },
      });
      return res.json({ message: "Bookmarked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
}
