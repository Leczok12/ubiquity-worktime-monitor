/*
  Warnings:

  - You are about to drop the column `DeviceId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `deviceId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workerId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_DeviceId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "DeviceId",
ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "workerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
