"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentComic_1 = require("@/controllers/comment/commentComic");
const express_1 = require("express");
const router = (0, express_1.Router)();
// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });
router.post("/comic/comment", commentComic_1.commentComic);
router.post("/conic/comment/reply", commentComic_1.replyComment);
exports.default = router;
