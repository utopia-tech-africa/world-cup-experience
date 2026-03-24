-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "city_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "included_items" TEXT[] DEFAULT ARRAY[]::TEXT[];
