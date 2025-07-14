"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addEpisode_1 = require("@/controllers/comic/addEpisode");
const comic_1 = require("@/controllers/comic/comic");
const comicDetail_1 = require("@/controllers/comic/comicDetail");
const createProduct_1 = require("@/controllers/comic/createProduct");
const multer_1 = require("@/utils/multer");
const express_1 = require("express");
const router = (0, express_1.Router)();
// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });
router.post("/product/add", multer_1.upload.array("covercomic", 2), createProduct_1.createComic);
router.get("/product", comic_1.getComics);
router.get("/product/detail", comicDetail_1.comicDetail);
router.post("/product/add/episode", multer_1.upload.array("image_episode"), addEpisode_1.addEpisode);
// 
exports.default = router;
