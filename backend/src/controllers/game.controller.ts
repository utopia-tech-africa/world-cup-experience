import { Request, Response } from "express";
import { prisma } from "../config/database.config";

/** GET /api/games — list games (optionally filter by type code) */
export const getGames = async (req: Request, res: Response) => {
  try {
    const typeCode = typeof req.query.typeCode === "string" ? req.query.typeCode : undefined;
    const games = await prisma.game.findMany({
      where: typeCode ? { type: { code: typeCode } } : undefined,
      include: { type: true },
      orderBy: [{ displayOrder: "asc" }, { matchDate: "asc" }],
    });
    res.json({
      games: games.map((g) => ({
        id: g.id,
        typeCode: g.type?.code ?? "",
        stadium: g.stadium,
        team1Name: g.team1Name,
        team2Name: g.team2Name,
        matchDate: g.matchDate,
        displayOrder: g.displayOrder,
      })),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch games";
    res.status(500).json({ error: message });
  }
};
