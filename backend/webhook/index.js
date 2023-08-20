import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
