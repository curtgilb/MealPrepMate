-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "storageInstructions" DROP NOT NULL,
ALTER COLUMN "perishable" DROP NOT NULL,
ALTER COLUMN "fridgeLife" DROP NOT NULL,
ALTER COLUMN "storageLife" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;
