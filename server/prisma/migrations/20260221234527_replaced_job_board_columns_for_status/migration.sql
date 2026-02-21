/*
  Warnings:

  - You are about to drop the column `jobBoardColumnId` on the `JobBoardEntry` table. All the data in the column will be lost.
  - You are about to drop the `JobBoardColumn` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,status,number]` on the table `JobBoardEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `JobBoardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'APPLIED', 'ASSESSMENT', 'INTERVIEW', 'OFFERED', 'REJECTED', 'ACCEPTED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "JobBoardColumn" DROP CONSTRAINT "JobBoardColumn_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobBoardEntry" DROP CONSTRAINT "JobBoardEntry_jobBoardColumnId_fkey";

-- DropIndex
DROP INDEX "JobBoardEntry_jobBoardColumnId_number_key";

-- AlterTable
ALTER TABLE "JobBoardEntry" DROP COLUMN "jobBoardColumnId",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "JobBoardColumn";

-- CreateIndex
CREATE UNIQUE INDEX "JobBoardEntry_userId_status_number_key" ON "JobBoardEntry"("userId", "status", "number");

-- AddForeignKey
ALTER TABLE "JobBoardEntry" ADD CONSTRAINT "JobBoardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
