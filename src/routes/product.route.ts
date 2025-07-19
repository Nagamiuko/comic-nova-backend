import { addEpisode } from "@/controllers/comic/addEpisode";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "@/controllers/comic/categories";
import { getComics } from "@/controllers/comic/comic";
import { comicDetail } from "@/controllers/comic/comicDetail";
import { createComic } from "@/controllers/comic/createProduct";
import {
  AuthenticationMiddleware,
  SecretKeyAuthentication,
} from "@/middleware/middleware";
import { upload } from "@/utils/multer";
import { Router } from "express";

const router = Router();

// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });

router.post(
  "/product/add",
  upload.array("covercomic", 2),
  AuthenticationMiddleware,
  createComic
);
router.get("/product", SecretKeyAuthentication, getComics);
router.get("/product/detail", SecretKeyAuthentication, comicDetail);
router.post(
  "/product/add/episode",
  upload.array("image_episode"),
  AuthenticationMiddleware,
  addEpisode
);

router.get("/categories", getAllCategories);
router.get("/categorie", getCategoryById);
router.post("/categorie/add", createCategory);
router.put("/categorie/update", updateCategory);
router.delete("/categorie/remove", deleteCategory);

export default router;
