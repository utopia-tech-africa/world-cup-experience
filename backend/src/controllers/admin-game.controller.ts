import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { z } from "zod";

const createGameSchema = z.object({
  typeId: z.string().uuid("Invalid type ID").optional().nullable(),
  stadium: z.string().min(1, "Stadium is required"),
  team1Name: z.string().min(1, "Team 1 name is required"),
  team2Name: z.string().min(1, "Team 2 name is required"),
  matchDate: z.string().min(1, "Match date is required"),
  displayOrder: z.number().int().min(0).default(0),
});

/** GET /api/admin/games — list all games (with type) */
export const getAdminGames = async (_req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      include: { type: true },
      orderBy: [{ displayOrder: "asc" }, { matchDate: "asc" }],
    });
    res.json({
      games: games.map((g) => ({
        id: g.id,
        typeId: g.typeId,
        type: g.type ? { id: g.type.id, name: g.type.name, code: g.type.code } : undefined,
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
    const { typeId, stadium, team1Name, team2Name, matchDate, displayOrder } = parsed.data;
    const typeIdToSet = typeId && typeId.trim() ? typeId : null;
    if (typeIdToSet) {
      const typeExists = await prisma.packageType.findUnique({ where: { id: typeIdToSet } });
      if (!typeExists) {
        res.status(400).json({ error: "Invalid package type" });
        return;
      }
    }
    const game = await prisma.game.create({
      data: { typeId: typeIdToSet, stadium, team1Name, team2Name, matchDate, displayOrder },
      include: { type: true },
    });
    res.status(201).json({
      game: {
        id: game.id,
        typeId: game.typeId,
        type: game.type ? { id: game.type.id, name: game.type.name, code: game.type.code } : undefined,
        stadium: game.stadium,
        team1Name: game.team1Name,
        team2Name: game.team2Name,
        matchDate: game.matchDate,
        displayOrder: game.displayOrder,
      },
    });
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
    const { typeId, stadium, team1Name, team2Name, matchDate, displayOrder } = parsed.data;
    const typeIdToSet = typeId && typeId.trim() ? typeId : null;
    if (typeIdToSet) {
      const typeExists = await prisma.packageType.findUnique({ where: { id: typeIdToSet } });
      if (!typeExists) {
        res.status(400).json({ error: "Invalid package type" });
        return;
      }
    }
    const game = await prisma.game.update({
      where: { id },
      data: { typeId: typeIdToSet, stadium, team1Name, team2Name, matchDate, displayOrder },
      include: { type: true },
    });
    res.json({
      game: {
        id: game.id,
        typeId: game.typeId,
        type: game.type ? { id: game.type.id, name: game.type.name, code: game.type.code } : undefined,
        stadium: game.stadium,
        team1Name: game.team1Name,
        team2Name: game.team2Name,
        matchDate: game.matchDate,
        displayOrder: game.displayOrder,
      },
    });
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
