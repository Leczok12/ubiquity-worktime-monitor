-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "remove" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "remove" BOOLEAN NOT NULL DEFAULT false;
