-- AlterTable
ALTER TABLE "JobBoardTag" ADD COLUMN "userId" INTEGER;

-- Update existing rows to use the first user
UPDATE "JobBoardTag" SET "userId" = (SELECT id FROM "User" LIMIT 1) WHERE "userId" IS NULL;

-- AlterTable
ALTER TABLE "JobBoardTag" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "JobBoardTag" ADD CONSTRAINT "JobBoardTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "JobBoardTag_userId_name_key" ON "JobBoardTag"("userId", "name");
