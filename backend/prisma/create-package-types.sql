-- Create package_types if missing (fix for DB that was migrated but table missing)
CREATE TABLE IF NOT EXISTS "package_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "package_types_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "package_types_code_key" ON "package_types"("code");

-- Insert default types (ignore if code already exists)
INSERT INTO "package_types" ("id", "name", "code", "display_order", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'Single game', 'single_game', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Double game', 'double_game', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Triple game', 'triple_game', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Quad game', 'quad_game', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;
