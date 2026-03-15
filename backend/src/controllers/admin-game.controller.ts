import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { z } from "zod";

const createGameSchema = z.object({
  typeId: z.string().uuid("Invalid type ID").optional().nullable(),
  stadium: z.string().min(1, "Stadium is required"),
  team1Id: z.string().uuid("Team 1 is required"),
  team2Id: z.string().uuid("Team 2 is required"),
  matchDate: z.string().min(1, "Match date is required"),
  displayOrder: z.number().int().min(0).default(0),
});

function gameToJson(g: {
  id: string;
  typeId: string | null;
  stadium: string;
  team1Id: string;
  team2Id: string;
  matchDate: string;
  displayOrder: number;
  type?: { id: string; name: string; code: string } | null;
  team1: { id: string; name: string; flagUrl: string | null; displayOrder: number };
  team2: { id: string; name: string; flagUrl: string | null; displayOrder: number };
}) {
  return {
    id: g.id,
    typeId: g.typeId,
    type: g.type ? { id: g.type.id, name: g.type.name, code: g.type.code } : undefined,
    stadium: g.stadium,
    team1Id: g.team1Id,
    team2Id: g.team2Id,
    team1: {
      id: g.team1.id,
      name: g.team1.name,
      flagUrl: g.team1.flagUrl ?? undefined,
      displayOrder: g.team1.displayOrder,
    },
    team2: {
      id: g.team2.id,
      name: g.team2.name,
      flagUrl: g.team2.flagUrl ?? undefined,
      displayOrder: g.team2.displayOrder,
    },
    matchDate: g.matchDate,
    displayOrder: g.displayOrder,
  };
}

/** GET /api/admin/games — list all games (with type and teams) */
export const getAdminGames = async (_req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      include: { type: true, team1: true, team2: true },
      orderBy: [{ displayOrder: "asc" }, { matchDate: "asc" }],
    });
    res.json({
      games: games.map((g) => gameToJson(g)),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch games";
    res.status(500).json({ error: message });
  }
};

/** POST /api/admin/games — create game */
export const createGame = async (req: Request, res: Response) => {
  try {
    const parsed = createGameSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const { typeId, stadium, team1Id, team2Id, matchDate, displayOrder } = parsed.data;
    const typeIdToSet = typeId && typeId.trim() ? typeId : null;
    if (typeIdToSet) {
      const typeExists = await prisma.packageType.findUnique({ where: { id: typeIdToSet } });
      if (!typeExists) {
        res.status(400).json({ error: "Invalid package type" });
        return;
      }
    }
    const [team1Exists, team2Exists] = await Promise.all([
      prisma.team.findUnique({ where: { id: team1Id } }),
      prisma.team.findUnique({ where: { id: team2Id } }),
    ]);
    if (!team1Exists) {
      res.status(400).json({ error: "Invalid team 1" });
      return;
    }
    if (!team2Exists) {
      res.status(400).json({ error: "Invalid team 2" });
      return;
    }
    const game = await prisma.game.create({
      data: {
        typeId: typeIdToSet,
        stadium,
        team1Id,
        team2Id,
        matchDate,
        displayOrder,
      },
      include: { type: true, team1: true, team2: true },
    });
    res.status(201).json({ game: gameToJson(game) });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create game";
    res.status(500).json({ error: message });
  }
};

/** PATCH /api/admin/games/:id — update game */
export const updateGame = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Game ID is required" });
      return;
    }
    const parsed = createGameSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const { typeId, stadium, team1Id, team2Id, matchDate, displayOrder } = parsed.data;
    const typeIdToSet = typeId && typeId.trim() ? typeId : null;
    if (typeIdToSet) {
      const typeExists = await prisma.packageType.findUnique({ where: { id: typeIdToSet } });
      if (!typeExists) {
        res.status(400).json({ error: "Invalid package type" });
        return;
      }
    }
    const [team1Exists, team2Exists] = await Promise.all([
      prisma.team.findUnique({ where: { id: team1Id } }),
      prisma.team.findUnique({ where: { id: team2Id } }),
    ]);
    if (!team1Exists) {
      res.status(400).json({ error: "Invalid team 1" });
      return;
    }
    if (!team2Exists) {
      res.status(400).json({ error: "Invalid team 2" });
      return;
    }
    const game = await prisma.game.update({
      where: { id },
      data: {
        typeId: typeIdToSet,
        stadium,
        team1Id,
        team2Id,
        matchDate,
        displayOrder,
      },
      include: { type: true, team1: true, team2: true },
    });
    res.json({ game: gameToJson(game) });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to update game";
    res.status(500).json({ error: message });
  }
};

/** DELETE /api/admin/games/:id */
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Game ID is required" });
      return;
    }
    await prisma.game.delete({ where: { id } });
    res.status(204).send();
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to delete game";
    res.status(500).json({ error: message });
  }
};
