/*
  Warnings:

  - You are about to drop the `Tasks` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `WorkEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WorkEventType" AS ENUM ('WORK', 'BREAK');

-- AlterTable
ALTER TABLE "WorkEvent" DROP COLUMN "type",
ADD COLUMN     "type" "WorkEventType" NOT NULL;

-- DropTable
DROP TABLE "Tasks";

-- DropEnum
DROP TYPE "WorkEventTypes";
