-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('WORK_START_STOP', 'WORK_START', 'WORK_STOP', 'BREAK_START_STOP', 'BREAK_START', 'BREAK_STOP');

-- DropForeignKey
ALTER TABLE "WorkEvent" DROP CONSTRAINT "WorkEvent_workerId_fkey";

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL DEFAULT 'WORK_START_STOP',

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "DeviceId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_DeviceId_fkey" FOREIGN KEY ("DeviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkEvent" ADD CONSTRAINT "WorkEvent_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
