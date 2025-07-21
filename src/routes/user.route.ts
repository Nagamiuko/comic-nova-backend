import { login } from "@/controllers/auth/login";
import { register } from "@/controllers/auth/register";
import { verifyEmail } from "@/controllers/auth/verifyEmail";
import {
  followUser,
  getUser,
  getUsers,
  getWriters,
} from "@/controllers/user.controller";
import { AuthenticationMiddleware } from "@/middleware/middleware";
import { Router } from "express";

const router = Router();

// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });

router.get("/users", AuthenticationMiddleware, getUsers);
router.get("/user", AuthenticationMiddleware, getUser);
router.get("/user/writers", AuthenticationMiddleware, getWriters);
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/verify-email", verifyEmail);

router.post("/user/follow", AuthenticationMiddleware, followUser);

export default router;
