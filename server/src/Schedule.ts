import { Job, Queue } from "bullmq";
import { Worker } from "bullmq";
import { db } from "./infrastructure/repository/db.js";
import { DateTime } from "luxon";
import { redis_connection } from "./infrastructure/Redis.js";

interface NotificationMessage {
  message: string;
}
const notificationsQueue = new Queue<NotificationMessage>(
  "notifications",
  redis_connection
);

const worker = new Worker(
  "notifications",
  async (job: Job<NotificationMessage>) => {
    await fetch(
      "https://discord.com/api/webhooks/1218807658585526292/_G7e1tROJ7JCF0El-Rv5__6pK_J5U8t-1myhFdnj_nBZWl3UOnHCy-wXoT2E-xUtt7-J",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: job.data.message }),
      }
    );
  },
  redis_connection
);

export { notificationsQueue };
