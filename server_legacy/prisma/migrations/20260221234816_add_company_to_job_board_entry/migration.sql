/*
  Warnings:

  - Added the required column `company` to the `JobBoardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobBoardEntry" ADD COLUMN     "company" TEXT NOT NULL;
