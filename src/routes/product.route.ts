
import { createComic, getComics } from "@/controllers/comic/createProduct";
import { upload } from "@/utils/multer";
import { Router } from "express";

const router = Router();

// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });

router.post("/product/add", upload.array('covercomic', 2), createComic)
router.get("/product", getComics)



export default router;
