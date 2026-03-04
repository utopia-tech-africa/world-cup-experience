-- AlterTable
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "start_date" TEXT;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "end_date" TEXT;
