import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const clients3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUD_API,
    credentials: {
        accessKeyId: process.env.CLOUD_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUD_SECRET_KEY!,
    },
});

const uploadParams = (file: any, folder: string) => {
    return {
        Bucket: process.env.CLOUD_BUCKET,
        Key: folder,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
};
const deleteParams = (file: any, folder: string) => {
    if (!file || !folder) {
        throw new Error(" File or Folder is missing!");
    }
    const key = `${folder}/${file}`.replace(/\/+/g, "/");
    return {
        Bucket: process.env.CLOUD_BUCKET,
        Key: key,
    };
};
export { clients3, uploadParams, deleteParams };