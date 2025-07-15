"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addEpisode_1 = require("@/controllers/comic/addEpisode");
const comic_1 = require("@/controllers/comic/comic");
const comicDetail_1 = require("@/controllers/comic/comicDetail");
const createProduct_1 = require("@/controllers/comic/createProduct");
const middleware_1 = require("@/middleware/middleware");
const multer_1 = require("@/utils/multer");
const express_1 = require("express");
const router = (0, express_1.Router)();
// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });
router.post("/product/add", multer_1.upload.array("covercomic", 2), middleware_1.AuthenticationMiddleware, createProduct_1.createComic);
router.get("/product", middleware_1.AuthenticationMiddleware, comic_1.getComics);
router.get("/product/detail", middleware_1.AuthenticationMiddleware, comicDetail_1.comicDetail);
router.post("/product/add/episode", multer_1.upload.array("image_episode"), middleware_1.AuthenticationMiddleware, addEpisode_1.addEpisode);
//
exports.default = router;
