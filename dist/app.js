"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("@/routes/route"));
const user_route_1 = __importDefault(require("@/routes/user.route"));
const product_route_1 = __importDefault(require("@/routes/product.route"));
const comment_route_1 = __importDefault(require("@/routes/comment.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://laughing-space-giggle-x7v5gq6w99vc64jr-8080.app.github.dev",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Welcome to api service v2");
});
app.use("/api", route_1.default);
app.use("/api", user_route_1.default);
app.use("/api", product_route_1.default);
app.use("/api", comment_route_1.default);
exports.default = app;
