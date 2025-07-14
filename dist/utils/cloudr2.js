"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteParams = exports.uploadParams = exports.clients3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const clients3 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: process.env.CLOUD_API,
    credentials: {
        accessKeyId: process.env.CLOUD_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUD_SECRET_KEY,
    },
});
exports.clients3 = clients3;
const uploadParams = (file, folder) => {
    return {
        Bucket: process.env.CLOUD_BUCKET,
        Key: folder,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
};
exports.uploadParams = uploadParams;
const deleteParams = (file, folder) => {
    if (!file || !folder) {
        throw new Error(" File or Folder is missing!");
    }
    const key = `${folder}/${file}`.replace(/\/+/g, "/");
    return {
        Bucket: process.env.CLOUD_BUCKET,
        Key: key,
    };
};
exports.deleteParams = deleteParams;
