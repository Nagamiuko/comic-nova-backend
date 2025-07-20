"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comicDetail = comicDetail;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function comicDetail(req, res) {
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
        return res.status(200).json({ message: "Fetch comic detail", data: comic });
    }
    catch (error) {
        console.error("comicDetail error:", error);
        return res.status(500).json({ message: "Failed to fetch comic detail" });
    }
}
