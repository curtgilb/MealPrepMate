import { readCSV } from "@/infrastructure/file_io/read.js";
import { db } from "@/infrastructure/repository/db.js";
import { Gender, SpecialCondition } from "@prisma/client";
import { z } from "zod";

const nutrientMapping: { [key: string]: string } = {
  vitmainA: "da4d4dd6-f827-42b4-b12b-fe2ae372b7c0",
  vitaminC: "55a450c0-53d4-4abe-8614-3f84bf992f20",
  vitaminD: "e51e0555-bd31-43ec-87d6-b69ccf94fe8a",
  vitaminE: "9c98797f-1893-49f9-b6cd-2b50a53ac142",
  vitaminK: "41048c3d-57b4-4be8-a1e4-5068f86cecab",
  thiamin: "c4598973-edb8-45b8-9d1c-568d11706286",
  riboflavin: "f16ecf94-5760-4fe7-ac93-dfee39f74e19",
  folate: "d1003ee8-6012-47bd-b300-ceeba70a2a6c",
  vitaminB12: "0707ff7b-e961-4ac4-b856-8ec71b60a957",
  pantothenicAcid: "e5e26bc1-89c2-4c87-be0a-f4e9d6faf99b",
  biotin: "e8b21fc3-5e4a-4993-9506-ca4ee00c3812",
  choline: "c094240d-b870-43b2-b30b-58b8afe997fd",
  calcium: "1ebb60b1-0c43-42ee-a198-c89207fbea02",
  chromium: "50b587d4-ee31-4536-9cc7-55db86600ca2",
  copper: "68a9025b-c83c-4dd6-a2e7-8148a87648b5",
  fluoride: "312e0d59-b844-4af9-b8ac-609b46eb2e52",
  iodine: "ad20f4f1-97c9-423f-9b9d-b2fd3585526e",
  iron: "03d691c4-71c9-4ed9-adbe-30f6a642df08",
  magnesium: "38615d24-cf5d-48b6-b71c-df60e97f5c15",
  manganese: "8bc0e4d9-c153-4127-8212-290a248cbc0f",
  molybdenum: "5f985f64-be5e-492a-8325-e598966d26c9",
  phosphorus: "9c39cb12-03c3-4870-a385-7ddf2bccb319",
  selenium: "8c659478-f2d1-41de-8c93-a1e5b436c17a",
  zinc: "2b29844f-7cca-4317-b88e-5ec1b8e78380",
  potassium: "4e9d4a3e-b8a9-464f-856a-3268ddd47c27",
  sodium: "485b501a-0f5c-4a2e-8abb-b9f3dae79ada",
  chloride: "d2a6f60f-f0d2-4294-86a6-9469987dbf6c",
};

const vitaminDriSchema = z.object({
  gender: z.preprocess(
    (val) => new String(val).toUpperCase(),
    z.nativeEnum(Gender)
  ),
  specialCondition: z.preprocess(
    (val) => new String(val).toUpperCase(),
    z.nativeEnum(SpecialCondition)
  ),
  minAge: z.coerce.number().min(1),
  maxAge: z.coerce.number().min(1),
  vitmainA: z.coerce.number().optional(),
  vitmainAMax: z.coerce.number().optional(),
  vitaminC: z.coerce.number().optional(),
  vitmainCMax: z.coerce.number().optional(),
  vitaminD: z.coerce.number().optional(),
  vitaminDMax: z.coerce.number().optional(),
  vitaminE: z.coerce.number().optional(),
  vitaminEMax: z.coerce.number().optional(),
  vitaminK: z.coerce.number().optional(),
  vitmainKMax: z.coerce.number().optional(),
  thiamin: z.coerce.number().optional(),
  thiaminMax: z.coerce.number().optional(),
  riboflavin: z.coerce.number().optional(),
  riboflavinMax: z.coerce.number().optional(),
  folate: z.coerce.number().optional(),
  folatMax: z.coerce.number().optional(),
  vitaminB12: z.coerce.number().optional(),
  vitaminB12Max: z.coerce.number().optional(),
  pantothenicAcid: z.coerce.number().optional(),
  biotin: z.coerce.number().optional(),
  biotinMax: z.coerce.number().optional(),
  choline: z.coerce.number().optional(),
  cholineMax: z.coerce.number().optional(),
});

const mineralDriSchema = z.object({
  gender: z.preprocess(
    (val) => new String(val).toUpperCase(),
    z.nativeEnum(Gender)
  ),
  specialCondition: z.preprocess(
    (val) => new String(val).toUpperCase(),
    z.nativeEnum(SpecialCondition)
  ),
  minAge: z.coerce.number().min(1),
  maxAge: z.coerce.number().min(1),
  calcium: z.coerce.number().optional(),
  calciumMax: z.coerce.number().optional(),
  chromium: z.coerce.number().optional(),
  chromiumMax: z.coerce.number().optional(),
  copper: z.coerce.number().optional(),
  copperMax: z.coerce.number().optional(),
  fluoride: z.coerce.number().optional(),
  fluorideMax: z.coerce.number().optional(),
  iodine: z.coerce.number().optional(),
  iodineMax: z.coerce.number().optional(),
  iron: z.coerce.number().optional(),
  ironMax: z.coerce.number().optional(),
  magnesium: z.coerce.number().optional(),
  magnesiumMax: z.coerce.number().optional(),
  manganese: z.coerce.number().optional(),
  manganeseMax: z.coerce.number().optional(),
  molybdenum: z.coerce.number().optional(),
  molybdenumMax: z.coerce.number().optional(),
  phosphorus: z.coerce.number().optional(),
  phosphorusMax: z.coerce.number().optional(),
  selenium: z.coerce.number().optional(),
  seleniumMax: z.coerce.number().optional(),
  zinc: z.coerce.number().optional(),
  zincMax: z.coerce.number().optional(),
  potassium: z.coerce.number().optional(),
  potassiumMax: z.coerce.number().optional(),
  sodium: z.coerce.number().optional(),
  sodiumMax: z.coerce.number().optional(),
  chloride: z.coerce.number().optional(),
  chlorideMax: z.coerce.number().optional(),
});

export async function loadDriRecommendations() {
  const mineralDris = await readCSV({
    path: "/data/seed_data/minerals_dri.csv",
    camelCaseHeaders: true,
    schema: mineralDriSchema,
  });

  const vitaminDris = await readCSV({
    path: "/data/seed_data/vitamins_dri.csv",
    camelCaseHeaders: true,
    schema: vitaminDriSchema,
  });

  await db.$transaction(async (tx) => {
    for (const mineral of [...mineralDris, ...vitaminDris]) {
      const { gender, specialCondition, minAge, maxAge, ...rest } = mineral;

      for (const [name, value] of Object.entries(rest)) {
        if (!name.endsWith("Max")) {
          const upperLimit = rest[name];
          const id = nutrientMapping[name];

          await tx.dailyReferenceIntake.upsert({
            where: {
              nutrientId_specialCondition_gender_ageMin_ageMax: {
                gender,
                specialCondition,
                ageMin: minAge,
                ageMax: maxAge,
                nutrientId: id,
              },
            },
            update: {
              gender: gender,
              specialCondition: specialCondition,
              ageMin: minAge,
              ageMax: maxAge,
              nutrient: { connect: { id: id } },
              value: value,
              upperLimit: upperLimit,
            },
            create: {
              gender: gender,
              specialCondition: specialCondition,
              ageMin: minAge,
              ageMax: maxAge,
              nutrient: { connect: { id: id } },
              value: value,
              upperLimit: upperLimit,
            },
          });
        }
      }
    }
  });
}
