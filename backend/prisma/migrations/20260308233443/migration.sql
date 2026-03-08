-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
