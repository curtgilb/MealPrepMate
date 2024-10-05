import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_HOST ?? "localhost",
  port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER ?? "",
  secretKey: process.env.MINIO_ROOT_PASSWORD ?? "",
});

console.log({
  endPoint: process.env.MINIO_HOST ?? "localhost",
  port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER ?? "",
  secretKey: process.env.MINIO_ROOT_PASSWORD ?? "",
});

export { minioClient as storage };
