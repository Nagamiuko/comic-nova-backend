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

export const AuthenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const clientkey = req.header("Authorization")?.split(" ")[1];
  const ua = req.headers["user-agent"] || "";

  try {
    const accessDeniedPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "access-denied.html"
    );

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
      return next("Authenticated Allow O..O");
    }
    return res.status(403).send(art3);
  } catch (err) {
    return res.status(500).send("Invalid Client Key !!");
  }
};
// export const SecretKeyAuthentication = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const secretkey = req.header("x-api-key");
//   console.log(secretkey);

//   try {
//     if (!secretkey) return res.status(401).send("Access Denied API KEY!!!");
//     const reCheck = await prismaService.user.findFirst({
//       where: {
//         secretkey: secretkey,
//       },
//     });
//     if (reCheck && secretkey === reCheck.secretkey) {
//       return next() && req.message(" Authenticated Allow !");
//     }
//     next();
//   } catch (err) {
//     return res.status(500).send("Invalid Secret Key !!");
//   }
// };
