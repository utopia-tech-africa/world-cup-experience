-- Add start_date/end_date to packages (no-op if packages table doesn't exist yet)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages') THEN
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "start_date" TEXT;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "end_date" TEXT;
  END IF;
END $$;
