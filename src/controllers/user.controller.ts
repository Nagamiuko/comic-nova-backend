import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "@/utils/token";

const prisma = new PrismaClient();

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true,
        profile: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
            role: true,
            accessToken: true,
          },
        },
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function getUser(req: Request, res: Response): Promise<any> {
  const { id } = req.query as any;
  try {
    const userId: any = verifyAccessToken(id);
    const user = await prisma.user.findUnique({
      where: { id: userId.id },
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true,
        profile: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
            role: true,
            likes: true,
            coins: true,
            transactions: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Fecth user successful", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
}

export async function getWriters(req: Request, res: Response): Promise<any> {
  const { username } = req.query as any;
  try {
    const user = await prisma.profile.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        likes: true,
        bio: true,
        followers: {
          select: {
            id: true,
            followerId: true,
            following: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        comics: {
          select: {
            id: true,
            title: true,
            coverUrl1: true,
            coverUrl2: true,
            status: true,
            tags: true,
            viewCount: true,
            likeCount: true,
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
            updatedAt: true,
            createdAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Fecth user successful", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
}

export const followUser = async (req: Request, res: Response): Promise<any> => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId || followerId === followingId) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    // ตรวจสอบว่ามีอยู่แล้วหรือยัง
    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return res.status(200).json({ message: "Already following" });
    }

    const follow = await prisma.follower.create({
      data: {
        followerId,
        followingId,
      },
    });

    return res.status(201).json({ message: "Followed successfully", follow });
  } catch (error) {
    console.error("Follow error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const userData = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { userId } = req.query as any;
//   try {
//     const ids = verifyAccessToken(userId);
//     console.log(ids);
//     const user = await prisma.user.findFirst({
//       where: { id: ids },
//       select: {
//         id: true,
//         email: true,
//         isVerified: true,
//         createdAt: true,
//         profile: {
//           select: {
//             username: true,
//             displayName: true,
//             avatarUrl: true,
//             role: true,
//           },
//         },
//       },
//     });
//     if (!user) {
//       return next(new ErrorHandler("User doesn't exists", 400));
//     }

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error.message });
//   }
// };
