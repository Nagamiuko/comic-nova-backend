import { likeComic, unlikeComic } from "@/controllers/comic/linkComic";
import { AuthenticationMiddleware } from "@/middleware/middleware";
import { Router } from "express";

const router = Router();


router.post("/comic/like",AuthenticationMiddleware, likeComic);
router.post("/comic/unlike",AuthenticationMiddleware, unlikeComic);

export default router;
