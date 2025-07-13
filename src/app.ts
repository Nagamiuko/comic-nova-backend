import express from "express";
import cors from "cors";
import routes from "@/routes/route";
import user from "@/routes/user.route";
import product from "@/routes/product.route"
import comments from "@/routes/comment.route"
import comic from "@/routes/comic.route"

const app = express();

app.use(cors({
    origin: ['https://laughing-space-giggle-x7v5gq6w99vc64jr-8080.app.github.dev'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
},
));
app.use(express.json());

app.use("/api", routes);
app.use("/api", user);
app.use("/api", product);
app.use("/api", comments);

export default app;
