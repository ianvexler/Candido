-- CreateTable
CREATE TABLE "JobBoardColumn" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "columnOrder" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "colour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobBoardColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobBoardEntry" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "salary" TEXT,
    "url" TEXT,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobBoardColumnId" INTEGER NOT NULL,

    CONSTRAINT "JobBoardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobBoardTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobBoardTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobBoardEntryToJobBoardTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobBoardEntryToJobBoardTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "JobBoardColumn_userId_columnOrder_idx" ON "JobBoardColumn"("userId", "columnOrder");

-- CreateIndex
CREATE INDEX "JobBoardColumn_colour_idx" ON "JobBoardColumn"("colour");

-- CreateIndex
CREATE UNIQUE INDEX "JobBoardColumn_userId_columnOrder_key" ON "JobBoardColumn"("userId", "columnOrder");

-- CreateIndex
CREATE INDEX "JobBoardEntry_title_idx" ON "JobBoardEntry"("title");

-- CreateIndex
CREATE UNIQUE INDEX "JobBoardEntry_jobBoardColumnId_number_key" ON "JobBoardEntry"("jobBoardColumnId", "number");

-- CreateIndex
CREATE INDEX "JobBoardTag_name_idx" ON "JobBoardTag"("name");

-- CreateIndex
CREATE INDEX "_JobBoardEntryToJobBoardTag_B_index" ON "_JobBoardEntryToJobBoardTag"("B");

-- AddForeignKey
ALTER TABLE "JobBoardColumn" ADD CONSTRAINT "JobBoardColumn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobBoardEntry" ADD CONSTRAINT "JobBoardEntry_jobBoardColumnId_fkey" FOREIGN KEY ("jobBoardColumnId") REFERENCES "JobBoardColumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobBoardEntryToJobBoardTag" ADD CONSTRAINT "_JobBoardEntryToJobBoardTag_A_fkey" FOREIGN KEY ("A") REFERENCES "JobBoardEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobBoardEntryToJobBoardTag" ADD CONSTRAINT "_JobBoardEntryToJobBoardTag_B_fkey" FOREIGN KEY ("B") REFERENCES "JobBoardTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
