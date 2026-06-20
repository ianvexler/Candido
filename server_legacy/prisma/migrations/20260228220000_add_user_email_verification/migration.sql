-- AlterTable
ALTER TABLE "User" ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "verificationToken" TEXT,
ADD COLUMN "verificationExpiresAt" TIMESTAMP(3);

-- Existing users are considered verified
UPDATE "User" SET "verified" = true;
