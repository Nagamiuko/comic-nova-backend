import { likeComic, unlikeComic } from "@/controllers/comic/linkComic";
import { Router } from "express";

const router = Router();


router.post("/comic/like", likeComic);
router.post("/comic/unlike", unlikeComic);

export default router;
