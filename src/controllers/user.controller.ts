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
