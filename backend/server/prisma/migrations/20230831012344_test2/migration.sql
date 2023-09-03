-- DropForeignKey
ALTER TABLE "PostMedia" DROP CONSTRAINT "PostMedia_postId_fkey";

-- AlterTable
ALTER TABLE "PostMedia" ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
