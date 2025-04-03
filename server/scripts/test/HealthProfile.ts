import { db } from "@/infrastructure/repository/db.js";

export async function loadHealthProfile() {
  await db.healthProfile.create({
    data: {
      weight: 180,
      gender: "MALE",
      bodyFatPercentage: 0.25,
      height: 72,
      yearBorn: 1994,
      activityLevel: 1.2,
      specialCondition: "NONE",
    },
  });
}
