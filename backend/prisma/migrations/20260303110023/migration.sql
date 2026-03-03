/*
  Warnings:

  - The values [FULL_ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `lastModified` to the `WorkEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SYSTEM_ADMIN', 'USER_ADMIN', 'EDITOR', 'VIEWER', 'WORKER');
ALTER TABLE "public"."User" ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "UserRole_new"[] USING ("roles"::text::"UserRole_new"[]);
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT ARRAY['WORKER']::"UserRole"[];
COMMIT;

-- AlterTable
ALTER TABLE "WorkEvent" ADD COLUMN     "lastModified" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastModifiedByUserId" TEXT,
ADD COLUMN     "placeEnd" TEXT,
ADD COLUMN     "placeStart" TEXT;

-- AddForeignKey
ALTER TABLE "WorkEvent" ADD CONSTRAINT "WorkEvent_lastModifiedByUserId_fkey" FOREIGN KEY ("lastModifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
