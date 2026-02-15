/*
  Warnings:

  - The primary key for the `Configuration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Configuration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Configuration_pkey" PRIMARY KEY ("key");
