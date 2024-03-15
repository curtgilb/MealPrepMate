import { db } from "./db.js";

await db.notificationSetting.create({
  data: {
    defrostWarningTime: "sdfsdf",
  },
});

console.log(new Date());
