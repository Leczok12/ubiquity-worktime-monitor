-- CreateEnum
CREATE TYPE "ScheduledEventStatus" AS ENUM ('PENDING', 'RUNNING', 'DONE', 'FAILED');

-- CreateTable
CREATE TABLE "ScheduledEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "runAt" TIMESTAMP(3) NOT NULL,
    "status" "ScheduledEventStatus" NOT NULL DEFAULT 'PENDING',
    "lockedAt" TIMESTAMP(3),
    "lockedBy" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledEvent_status_runAt_idx" ON "ScheduledEvent"("status", "runAt");
