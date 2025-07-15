import { getComics } from "@/controllers/comic/comic";
import { createComic } from "@/controllers/comic/createProduct";
import { commentComic, replyComment } from "@/controllers/comment/commentComic";
import { AuthenticationMiddleware } from "@/middleware/middleware";
import { upload } from "@/utils/multer";
import { Router } from "express";

const router = Router();

// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });

router.post("/comic/comment", AuthenticationMiddleware,commentComic);
router.post("/conic/comment/reply",AuthenticationMiddleware, replyComment);

export default router;
