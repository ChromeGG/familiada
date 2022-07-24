/*
  Warnings:

  - Added the required column `language` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PL', 'EN');

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "questionId" INTEGER;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "language" "Language" NOT NULL;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
