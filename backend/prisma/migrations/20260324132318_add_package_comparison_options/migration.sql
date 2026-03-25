-- CreateEnum
CREATE TYPE "PackageComparisonTier" AS ENUM ('three_star', 'four_star');

-- CreateTable
CREATE TABLE "package_options" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "tier" "PackageComparisonTier" NOT NULL,
    "label" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "room_label" TEXT,
    "image_url" TEXT,
    "cta_label" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_option_features" (
    "id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "line_key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon_key" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_option_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "package_options_package_id_tier_key" ON "package_options"("package_id", "tier");

-- CreateIndex
CREATE INDEX "package_option_features_option_id_line_key_idx" ON "package_option_features"("option_id", "line_key");

-- AddForeignKey
ALTER TABLE "package_options" ADD CONSTRAINT "package_options_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_option_features" ADD CONSTRAINT "package_option_features_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "package_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
