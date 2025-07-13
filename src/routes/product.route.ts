import { addEpisode } from "@/controllers/comic/addEpisode";
import { getComics } from "@/controllers/comic/comic";
import { comicDetail } from "@/controllers/comic/comicDetail";
import { createComic } from "@/controllers/comic/createProduct";
import { upload } from "@/utils/multer";
import { Router } from "express";

const router = Router();

// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });

router.post("/product/add", upload.array("covercomic", 2), createComic);
router.get("/product", getComics);
router.get("/product/detail", comicDetail);
router.post("/product/add/episode", upload.array("image_episode"), addEpisode);
// 

export default router;
