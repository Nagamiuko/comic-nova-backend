"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
exports.verifyAccessToken = verifyAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
}
const sendToken = (user, statusCode, res) => {
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "None",
        secure: true,
    };
    res
        .status(Number(statusCode))
        .cookie("_login_info_", token, options)
        .json({
        success: true,
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            profile: user.profile,
        },
    });
};
exports.sendToken = sendToken;
