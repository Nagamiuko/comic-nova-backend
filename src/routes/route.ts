import { Router, Request, Response } from "express";

const router = Router();

// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });

router.get("/status", (req: Request, res: Response) => {
  res.json({ message: "welcome to api" });
});

export default router;
