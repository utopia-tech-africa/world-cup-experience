-- Add type_id to packages and backfill from package_types (by code)
-- Safe to run if type_id already exists (no-op for existing columns)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'type_id'
  ) THEN
    ALTER TABLE "packages" ADD COLUMN "type_id" TEXT;
  END IF;
END $$;

-- Backfill type_id from package_types where packages.type (enum) matches code (only if type column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'type') THEN
    UPDATE "packages" p
    SET "type_id" = (SELECT pt.id FROM "package_types" pt WHERE pt.code = p.type::text LIMIT 1)
    WHERE p."type_id" IS NULL;
  END IF;
END $$;

-- Fill any remaining NULL type_id with first package type (e.g. if type column was already dropped)
UPDATE "packages" p
SET "type_id" = (SELECT id FROM "package_types" ORDER BY display_order ASC LIMIT 1)
WHERE p."type_id" IS NULL;

-- Set NOT NULL
ALTER TABLE "packages" ALTER COLUMN "type_id" SET NOT NULL;

-- Drop old type column (enum) if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'type'
  ) THEN
    ALTER TABLE "packages" DROP COLUMN "type";
  END IF;
END $$;

-- Add foreign key if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'packages_type_id_fkey' AND table_name = 'packages'
  ) THEN
    ALTER TABLE "packages" ADD CONSTRAINT "packages_type_id_fkey"
      FOREIGN KEY ("type_id") REFERENCES "package_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
