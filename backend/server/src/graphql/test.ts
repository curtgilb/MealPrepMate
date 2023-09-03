import { db } from "../db.js";
import { deleteAllRecords } from "../seed/seed.js";

await deleteAllRecords();
await db.media.createMany({
  data: [
    {
      url: "https://1",
      uploadedById: 1,
    },
    {
      url: "https://2",
      uploadedById: 2,
    },
    {
      url: "https://3",
      uploadedById: 3,
    },
  ],
});

await db.post.create({
  data: {
    title: "Hello World",
    content: "This is my first post",
    media: {
      create: [
        { media: { create: { url: "https://jsdlfkj", uploadedById: 5 } } },
      ],
    },
  },
});

// Filling in join table
await db.post.create({
  data: {
    title: "Test",
    content: "This is my test",
    media: {
      create: [
        {
          media: { create: { url: "https://jsdlfkj", uploadedById: 10 } },
          testField: "test",
        },
      ],
    },
  },
});
