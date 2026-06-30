/*
  Warnings:

  - You are about to drop the column `sync` on the `Worker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "sync",
ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true;
