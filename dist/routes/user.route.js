"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("@/controllers/auth/login");
const register_1 = require("@/controllers/auth/register");
const verifyEmail_1 = require("@/controllers/auth/verifyEmail");
const user_controller_1 = require("@/controllers/user.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
// router.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok" });
// });
router.get("/users", user_controller_1.getUsers);
router.post("/user/register", register_1.register);
router.post("/user/login", login_1.login);
router.post("/verify-email", verifyEmail_1.verifyEmail);
exports.default = router;
