/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Client } from "minio";

const minioClient = new Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "admin",
  secretKey: "password1",
});

try {
  const response = await minioClient.presignedPutObject(
    "images",
    "hello.txt",
    24 * 60 * 60
  );
  console.log(response);
} catch (error) {
  console.log(error);
}

// accessKey: "hlYr0DKojQRcguCsDYqX",
// secretKey: "oFnaNy89mJwkyFTJGqS2u2uvaXsZQn7K8epGmRzh",
