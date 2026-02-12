/*
  Warnings:

  - The values [START,END] on the enum `WorkEventTypes` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `timeEnd` to the `WorkEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeStart` to the `WorkEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkEventTypes_new" AS ENUM ('WORK', 'BREAK');
ALTER TABLE "WorkEvent" ALTER COLUMN "type" TYPE "WorkEventTypes_new" USING ("type"::text::"WorkEventTypes_new");
ALTER TYPE "WorkEventTypes" RENAME TO "WorkEventTypes_old";
ALTER TYPE "WorkEventTypes_new" RENAME TO "WorkEventTypes";
DROP TYPE "public"."WorkEventTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "WorkEvent" ADD COLUMN     "timeEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeStart" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);
