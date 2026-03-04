-- Add type_id to packages and backfill from package_types (by code).
-- No-op when run before packages/package_types exist (migration order quirk); the actual
-- schema change is done by 20260303120000_package_types_table.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages')
     OR NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'package_types') THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'type_id'
  ) THEN
    ALTER TABLE "packages" ADD COLUMN "type_id" TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages')
     OR NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'package_types') THEN
    RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'type') THEN
    UPDATE "packages" p
    SET "type_id" = (SELECT pt.id FROM "package_types" pt WHERE pt.code = p.type::text LIMIT 1)
    WHERE p."type_id" IS NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages')
     OR NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'package_types') THEN
    RETURN;
  END IF;
  UPDATE "packages" p
  SET "type_id" = (SELECT id FROM "package_types" ORDER BY display_order ASC LIMIT 1)
  WHERE p."type_id" IS NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages')
     OR NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'package_types') THEN
    RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'type_id') THEN
    ALTER TABLE "packages" ALTER COLUMN "type_id" SET NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages') THEN
    RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'type') THEN
    ALTER TABLE "packages" DROP COLUMN "type";
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages')
     OR NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'package_types') THEN
    RETURN;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'packages_type_id_fkey' AND table_name = 'packages'
  ) THEN
    ALTER TABLE "packages" ADD CONSTRAINT "packages_type_id_fkey"
      FOREIGN KEY ("type_id") REFERENCES "package_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
