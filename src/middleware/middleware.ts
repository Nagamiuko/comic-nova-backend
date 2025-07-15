import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "@/utils/token";
import path from "path";

const prisma = new PrismaClient();
const art3 = `
+-----------------------------+
|           ______            |
|        .-'      '-.         |
|       /            \\        |
|      |              |       | 
|      |,  .-.  .-.  ,|       |
|      | )(_o/  \\o_)( |       |
|      |/     /\\     \\|       |
|      (_     ^^     _)       |
|       \\__|IIIIII|__/        |
|        | \\IIIIII/  |        |
|         \\\\       //         |
|          \\\\_____//          | 
|                             |
|   ☠️  ACCESS DENIED  ☠️    |
| Unauthorized user detected. |
+-----------------------------+
`;

const accessDeniedPath = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "access-denied.html"
);
export const AuthenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const clientkey = req.header("Authorization")?.split(" ")[1] as any;
  const ua = req.headers["user-agent"] || "";

  try {
    console.log(clientkey);

    if (!clientkey) {
      if (/postman|curl|insomnia/i.test(ua)) {
        return res.status(403).json(art3);
      }
      return res.status(401).sendFile(accessDeniedPath);
    }
    const reCheck = await prisma.profile.findFirst({
      where: {
        accessToken: clientkey,
      },
      include: {
        user: {
          select: {
            isVerified: true,
          },
        },
      },
    });
    if (reCheck?.user.isVerified === false)
      return res.status(401).send("Please verify your identity !!!");
    if (reCheck && clientkey === reCheck.accessToken) {
      return next();
    }
    return res.status(403).send(art3);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Invalid Client Key !!");
  }
};
export const SecretKeyAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const secretkey = req.header("x-api-key");
  const ua = req.headers["user-agent"] || "";
  try {
    if (!secretkey) {
      if (/postman|curl|insomnia/i.test(ua)) {
        return res.status(403).json(art3);
      }
      return res.status(401).sendFile(accessDeniedPath);
    }

    if (secretkey && secretkey === process.env.API_KEY) {
      return next();
    }
    return res.status(403).send(art3);
  } catch (err) {
    return res.status(500).send("Invalid Secret Key !!");
  }
};
