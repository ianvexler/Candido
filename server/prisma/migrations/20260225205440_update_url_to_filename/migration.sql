/*
  Warnings:

  - You are about to drop the column `coverLetterUrl` on the `JobBoardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `cvUrl` on the `JobBoardEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobBoardEntry" DROP COLUMN "coverLetterUrl",
DROP COLUMN "cvUrl",
ADD COLUMN     "coverLetterFilename" TEXT,
ADD COLUMN     "cvFilename" TEXT;
