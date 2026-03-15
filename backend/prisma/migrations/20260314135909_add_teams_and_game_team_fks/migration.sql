-- CreateTable teams first
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag_url" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- Add nullable team columns to games so we can backfill
ALTER TABLE "games" ADD COLUMN "team1_id" TEXT, ADD COLUMN "team2_id" TEXT;

-- Insert distinct teams from existing game data (team1 and team2 columns)
INSERT INTO "teams" ("id", "name", "flag_url", "display_order", "created_at", "updated_at")
SELECT gen_random_uuid(), "name", "flag_url", 0, NOW(), NOW()
FROM (
  SELECT DISTINCT "team1_name" AS "name", "team1_flag_url" AS "flag_url" FROM "games"
  UNION
  SELECT DISTINCT "team2_name", "team2_flag_url" FROM "games"
) u;

-- Link games to teams by matching name and flag_url
UPDATE "games" g
SET "team1_id" = t."id"
FROM "teams" t
WHERE g."team1_name" = t."name"
  AND (g."team1_flag_url" IS NOT DISTINCT FROM t."flag_url");

UPDATE "games" g
SET "team2_id" = t."id"
FROM "teams" t
WHERE g."team2_name" = t."name"
  AND (g."team2_flag_url" IS NOT DISTINCT FROM t."flag_url");

-- Now enforce NOT NULL (any rows without match would fail; we assume all matched)
ALTER TABLE "games" ALTER COLUMN "team1_id" SET NOT NULL, ALTER COLUMN "team2_id" SET NOT NULL;

-- Drop old columns
ALTER TABLE "games" DROP COLUMN "team1_name", DROP COLUMN "team2_name", DROP COLUMN "team1_flag_url", DROP COLUMN "team2_flag_url";

-- Add foreign keys
ALTER TABLE "games" ADD CONSTRAINT "games_team1_id_fkey" FOREIGN KEY ("team1_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "games" ADD CONSTRAINT "games_team2_id_fkey" FOREIGN KEY ("team2_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
