import { Request, Response } from "express";
import { PrismaClient, ComicStatus, EpisodeType } from "@prisma/client";
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

export async function createComic(req: Request, res: Response): Promise<any> {
  const { title, description, tags, status } = req.body;
  const { userId }: KeyId = req.query;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!title) return res.status(400).json({ message: "Title is required" });

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    return res.status(400).json({ message: "No files uploaded" });

  try {
    const result: Record<FolderKey, string[]> = {
      "1080x1920": [] as string[],
      "1080x1080": [] as string[],
      others: [] as string[],
    };

    console.log(result);

    await Promise.all(
      files.map(async (file) => {
        const buffer = file.buffer || fs.readFileSync(file.path);
        const image = sharp(buffer);
        const metadata = await image.metadata();

        let folder: FolderKey = "others";
        if (metadata.width === 1080 && metadata.height === 1920)
          folder = "1080x1920";
        if (metadata.width === 1080 && metadata.height === 1080)
          folder = "1080x1080";

        const fileExt = path.extname(file.originalname) || ".jpg";
        const fileKey = `folder/${folder}/${uuidv4()}${fileExt}`;

        const up = uploadParams(file, fileKey);

        await clients3.send(new PutObjectCommand(up));

        const publicUrl = `https://pub-ba5965ac0d8a4e23b9781b3defa3c6d1.r2.dev/comic-nova/${up.Key}`;
        result[folder].push(publicUrl);
      })
    );

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const comic = await prisma.comic.create({
      data: {
        title,
        description,
        coverUrl1: result["1080x1080"],
        coverUrl2: result["1080x1920"],
        tags: tags ? JSON.parse(tags) : [],
        status: status || ComicStatus.ongoing,
        author: { connect: { id: profile.id } },
      },
    });

    return res
      .status(201)
      .json({ message: "Upload comic successful", data: comic });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create comic" });
  }
}
