-- Create join table between packages and games
-- Use TEXT columns to match existing packages.id and games.id types in the database.

DROP TABLE IF EXISTS "package_games" CASCADE;

CREATE TABLE "package_games" (
  "package_id" TEXT NOT NULL,
  "game_id" TEXT NOT NULL,
  CONSTRAINT "package_games_pkey" PRIMARY KEY ("package_id", "game_id"),
  CONSTRAINT "package_games_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "package_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
