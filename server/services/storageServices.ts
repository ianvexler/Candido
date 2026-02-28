import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "../uploads");

const useS3 = !!process.env["AWS_BUCKET_NAME"];
const s3Client = useS3
  ? new S3Client({ region: process.env["AWS_REGION"] ?? "us-east-1" })
  : null;

const storageService = {
  async upload(key: string, buffer: Buffer) {
    if (useS3 && s3Client) {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env["AWS_BUCKET_NAME"]!,
          Key: key,
          Body: buffer,
          ContentType: "application/pdf",
        })
      );
    } else {
      const filePath = path.join(UPLOADS_DIR, key);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
    }
  },

  async getFile(key: string): Promise<Buffer | null> {
    if (useS3 && s3Client) {
      const response = await s3Client.send(
        new GetObjectCommand({
          Bucket: process.env["AWS_BUCKET_NAME"]!,
          Key: key,
        })
      );
      if (!response.Body) return null;
      return Buffer.from(await response.Body.transformToByteArray());
    }

    const filePath = path.join(UPLOADS_DIR, key);
    try {
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  },

  async deleteFile(key: string) {
    if (useS3 && s3Client) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env["AWS_BUCKET_NAME"]!,
          Key: key,
        })
      );
    } else {
      const filePath = path.join(UPLOADS_DIR, key);
      try {
        await fs.unlink(filePath);
      } catch {
        // File may not exist
      }
    }
  },
};

export default storageService;
