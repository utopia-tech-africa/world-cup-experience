-- CreateTable
CREATE TABLE "package_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "package_types_code_key" ON "package_types"("code");

-- Insert default package types
INSERT INTO "package_types" ("id", "name", "code", "display_order", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'Single game', 'single_game', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Double game', 'double_game', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Triple game', 'triple_game', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Quad game', 'quad_game', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add type_id to packages and backfill
ALTER TABLE "packages" ADD COLUMN "type_id" TEXT;

UPDATE "packages" p
SET "type_id" = (SELECT pt.id FROM "package_types" pt WHERE pt.code = p.type::text LIMIT 1);

ALTER TABLE "packages" ALTER COLUMN "type_id" SET NOT NULL;

ALTER TABLE "packages" DROP COLUMN "type";

ALTER TABLE "packages" ADD CONSTRAINT "packages_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "package_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Convert bookings.package_type from enum to varchar
ALTER TABLE "bookings" ADD COLUMN "package_type_new" TEXT;

UPDATE "bookings" SET "package_type_new" = "package_type"::text;

ALTER TABLE "bookings" DROP COLUMN "package_type";

ALTER TABLE "bookings" RENAME COLUMN "package_type_new" TO "package_type";

-- Drop enum
DROP TYPE "PackageType";

-- Add FK from games.type_id to package_types (games table created in 20260228120000, before package_types existed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'games_type_id_fkey' AND table_name = 'games'
  ) AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'games') THEN
    ALTER TABLE "games" ADD CONSTRAINT "games_type_id_fkey"
      FOREIGN KEY ("type_id") REFERENCES "package_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
