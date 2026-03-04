-- CreateTable (FK to package_types added later in 20260303120000 when package_types exists)
CREATE TABLE IF NOT EXISTS "games" (
    "id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "stadium" TEXT NOT NULL,
    "team1_name" TEXT NOT NULL,
    "team2_name" TEXT NOT NULL,
    "match_date" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);
