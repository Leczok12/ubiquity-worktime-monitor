/*
  Warnings:

  - The values [WORK_START,WORK_STOP,BREAK_START_STOP] on the enum `DeviceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeviceType_new" AS ENUM ('WORK_START_STOP', 'BREAK_START', 'BREAK_STOP', 'UNUSED');
ALTER TABLE "public"."Device" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Device" ALTER COLUMN "type" TYPE "DeviceType_new" USING ("type"::text::"DeviceType_new");
ALTER TYPE "DeviceType" RENAME TO "DeviceType_old";
ALTER TYPE "DeviceType_new" RENAME TO "DeviceType";
DROP TYPE "public"."DeviceType_old";
ALTER TABLE "Device" ALTER COLUMN "type" SET DEFAULT 'WORK_START_STOP';
COMMIT;
