/*
  Warnings:

  - You are about to drop the column `coverLetterOriginalFilename` on the `JobBoardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `cvOriginalFilename` on the `JobBoardEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobBoardEntry" DROP COLUMN "coverLetterOriginalFilename",
DROP COLUMN "cvOriginalFilename",
ADD COLUMN     "coverLetterKey" TEXT,
ADD COLUMN     "cvKey" TEXT;
