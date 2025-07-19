"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretKeyAuthentication = exports.AuthenticationMiddleware = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const art3 = `
+-----------------------------+
|           ______            |
|        .-'      '-.         |
|       /            \\        |
|      |              |       | 
|      |,  .-.  .-.  ,|       |
|      | )(_o/  \\o_)( |       |
|      |/     /\\     \\|       |
|      (_     ^^     _)       |
|       \\__|IIIIII|__/        |
|        | \\IIIIII/  |        |
|         \\\\       //         |
|          \\\\_____//          | 
|                             |
|   ☠️  ACCESS DENIED  ☠️    |
| Unauthorized user detected. |
+-----------------------------+
`;
const accessDeniedPath = path_1.default.join(__dirname, "..", "..", "public", "access-denied.html");
const AuthenticationMiddleware = async (req, res, next) => {
    const clientkey = req.header("Authorization")?.split(" ")[1];
    const ua = req.headers["user-agent"] || "";
    try {
        console.log(clientkey);
        if (!clientkey) {
            if (/postman|curl|insomnia/i.test(ua)) {
                return res.status(403).json(art3);
            }
            return res.status(401).sendFile(accessDeniedPath);
        }
        const reCheck = await prisma.profile.findFirst({
            where: {
                accessToken: clientkey,
            },
            include: {
                user: {
                    select: {
                        isVerified: true,
                    },
                },
            },
        });
        if (reCheck?.user.isVerified === false)
            return res.status(401).send("Please verify your identity !!!");
        if (reCheck && clientkey === reCheck.accessToken) {
            return next();
        }
        return res.status(403).send(art3);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Invalid Client Key !!");
    }
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
const SecretKeyAuthentication = async (req, res, next) => {
    const secretkey = req.header("x-api-key");
    const ua = req.headers["user-agent"] || "";
    try {
        if (!secretkey) {
            if (/postman|curl|insomnia/i.test(ua)) {
                return res.status(403).json(art3);
            }
            return res.status(401).sendFile(accessDeniedPath);
        }
        if (secretkey && secretkey === process.env.API_KEY) {
            return next();
        }
        return res.status(403).send(art3);
    }
    catch (err) {
        return res.status(500).send("Invalid Secret Key !!");
    }
};
exports.SecretKeyAuthentication = SecretKeyAuthentication;
