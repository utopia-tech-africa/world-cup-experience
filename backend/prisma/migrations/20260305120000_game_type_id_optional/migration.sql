-- Make Game.typeId optional so games can be linked to packages only via package_games
ALTER TABLE "games" ALTER COLUMN "type_id" DROP NOT NULL;
