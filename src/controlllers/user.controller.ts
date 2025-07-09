import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
            role: true
          }
        }
      }
    })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch users" })
  }
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
            role: true
          }
        }
      }
    })

    if (!user) return res.status(404).json({ message: "User not found" })

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching user" })
  }
}
