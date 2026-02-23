/*
  Warnings:

  - You are about to drop the column `remove` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `remove` on the `Worker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "remove";

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "remove";
