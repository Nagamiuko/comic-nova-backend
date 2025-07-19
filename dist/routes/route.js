"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });
router.get("/", (req, res) => {
    res.json({ message: "welcome to api" });
});
exports.default = router;
