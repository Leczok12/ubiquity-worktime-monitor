/*
  Warnings:

  - Added the required column `active` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "active" BOOLEAN NOT NULL;
