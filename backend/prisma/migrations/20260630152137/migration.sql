/*
  Warnings:

  - You are about to drop the column `sync` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "sync",
ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true;
