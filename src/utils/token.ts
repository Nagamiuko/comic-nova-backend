import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface Opction {
  expires: Date;
  httpOnly: boolean;
  sameSite: any;
  secure: boolean;
}
export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
}

export const sendToken = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
  const options: Opction = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  
  res
    .status(Number(statusCode))
    .cookie("_login_info_", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile,
      },
    });
};
