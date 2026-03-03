-- CreateTable
CREATE TABLE "JobBoardEntryNotes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "jobBoardEntryId" INTEGER NOT NULL,

    CONSTRAINT "JobBoardEntryNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobBoardEntryNotes_userId_jobBoardEntryId_idx" ON "JobBoardEntryNotes"("userId", "jobBoardEntryId");

-- AddForeignKey
ALTER TABLE "JobBoardEntryNotes" ADD CONSTRAINT "JobBoardEntryNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobBoardEntryNotes" ADD CONSTRAINT "JobBoardEntryNotes_jobBoardEntryId_fkey" FOREIGN KEY ("jobBoardEntryId") REFERENCES "JobBoardEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
