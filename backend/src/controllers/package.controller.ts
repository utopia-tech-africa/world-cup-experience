import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { nightsBetween } from "../utils/date.utils";

type PackageWithType = {
  id: string;
  name: string;
  typeId: string;
  duration: string;
  startDate: string | null;
  endDate: string | null;
  hostelPrice: unknown;
  hotelPrice: unknown;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: { id: string; name: string; code: string; displayOrder: number };
  packageGames?: Array<{
    game: { id: string; stadium: string; team1Name: string; team2Name: string; matchDate: string; displayOrder: number };
  }>;
};

function serializePackage(
  pkg: PackageWithType,
  gamesByTypeId: Record<
    string,
    Array<{ id: string; stadium: string; team1Name: string; team2Name: string; matchDate: string; displayOrder: number }>
  >
) {
  const packageGames = pkg.packageGames ?? [];
  const games =
    packageGames.length > 0
      ? packageGames.map((pg) => ({
          id: pg.game.id,
          typeCode: pkg.type.code,
          stadium: pg.game.stadium ?? "",
          team1Name: pg.game.team1Name ?? "",
          team2Name: pg.game.team2Name ?? "",
          matchDate: pg.game.matchDate ?? "",
          displayOrder: pg.game.displayOrder ?? 0,
        }))
      : (gamesByTypeId[pkg.typeId] ?? []).map((g) => ({
          id: g.id,
          typeCode: pkg.type.code,
          stadium: g.stadium ?? "",
          team1Name: g.team1Name ?? "",
          team2Name: g.team2Name ?? "",
          matchDate: g.matchDate ?? "",
          displayOrder: g.displayOrder ?? 0,
        }));
  const nights = nightsBetween(pkg.startDate, pkg.endDate);
  return {
    id: pkg.id,
    name: pkg.name,
    type: pkg.type.code,
    typeName: pkg.type.name,
    duration: pkg.duration,
    startDate: pkg.startDate ?? undefined,
    endDate: pkg.endDate ?? undefined,
    nights: nights ?? undefined,
    hostelPrice: Number(pkg.hostelPrice),
    hotelPrice: Number(pkg.hotelPrice),
    displayOrder: pkg.displayOrder,
    isActive: pkg.isActive,
    games,
  };
}

/** GET /api/packages — list active packages with nested games (public, for booking/games) */
export const getPackages = async (_req: Request, res: Response) => {
  try {
    const [packages, allGames] = await Promise.all([
      prisma.bookingPackage.findMany({
        where: { isActive: true },
        include: { type: true, packageGames: { include: { game: true } } },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      }),
      prisma.game.findMany({
        orderBy: [{ displayOrder: "asc" }, { matchDate: "asc" }],
      }),
    ]);

    const gamesByTypeId = allGames.reduce<
      Record<
        string,
        Array<{ id: string; stadium: string; team1Name: string; team2Name: string; matchDate: string; displayOrder: number }>
      >
    >((acc, g) => {
      if (!g.typeId) return acc;
      const list = acc[g.typeId] ?? [];
      list.push({
        id: g.id,
        stadium: g.stadium,
        team1Name: g.team1Name,
        team2Name: g.team2Name,
        matchDate: g.matchDate,
        displayOrder: g.displayOrder,
      });
      acc[g.typeId] = list;
      return acc;
    }, {});

    res.json({
      packages: packages.map((pkg) => serializePackage(pkg as PackageWithType, gamesByTypeId)),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch packages";
    res.status(500).json({ error: message });
  }
};
