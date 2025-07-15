import { login } from "@/controllers/auth/login";
import { register } from "@/controllers/auth/register";
import { verifyEmail } from "@/controllers/auth/verifyEmail";
import { getUser, getUsers } from "@/controllers/user.controller";
import { AuthenticationMiddleware } from "@/middleware/middleware";
import { Router } from "express";

const router = Router();

// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });

router.get("/users", AuthenticationMiddleware, getUsers);
router.get("/user", AuthenticationMiddleware, getUser);
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/verify-email", verifyEmail);

export default router;
