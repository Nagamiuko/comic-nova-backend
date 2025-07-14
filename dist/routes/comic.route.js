"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linkComic_1 = require("@/controllers/comic/linkComic");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/comic/like", linkComic_1.likeComic);
router.post("/comic/unlike", linkComic_1.unlikeComic);
exports.default = router;
