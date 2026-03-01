-- CreateTable
CREATE TABLE "_WorkerGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkerGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_WorkerGroups_B_index" ON "_WorkerGroups"("B");

-- AddForeignKey
ALTER TABLE "_WorkerGroups" ADD CONSTRAINT "_WorkerGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkerGroups" ADD CONSTRAINT "_WorkerGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
