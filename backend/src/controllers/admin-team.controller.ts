import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { uploadFlagToCloudinary } from "../services/storage.service";
import { z } from "zod";

const createTeamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  displayOrder: z.number().int().min(0).default(0),
});

function teamToJson(t: {
  id: string;
  name: string;
  flagUrl: string | null;
  displayOrder: number;
}) {
  return {
    id: t.id,
    name: t.name,
    flagUrl: t.flagUrl ?? undefined,
    displayOrder: t.displayOrder,
  };
}

/** GET /api/admin/teams — list all teams */
export const getAdminTeams = async (_req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    res.json({
      teams: teams.map((t) => teamToJson(t)),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch teams";
    res.status(500).json({ error: message });
  }
};

/** POST /api/admin/teams — create team */
export const createTeam = async (req: Request, res: Response) => {
  try {
    const parsed = createTeamSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const { name, displayOrder } = parsed.data;
    const team = await prisma.team.create({
      data: { name: name.trim(), displayOrder },
    });
    res.status(201).json({ team: teamToJson(team) });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create team";
    res.status(500).json({ error: message });
  }
};

/** PATCH /api/admin/teams/:id — update team */
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Team ID is required" });
      return;
    }
    const parsed = createTeamSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const { name, displayOrder } = parsed.data;
    const team = await prisma.team.update({
      where: { id },
      data: { name: name.trim(), displayOrder },
    });
    res.json({ team: teamToJson(team) });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to update team";
    res.status(500).json({ error: message });
  }
};

/** POST /api/admin/teams/:id/flag — upload team flag (multipart: file field "flag") */
export const uploadTeamFlag = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Team ID is required" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "Flag image file is required" });
      return;
    }
    const url = await uploadFlagToCloudinary(req.file);
    const team = await prisma.team.update({
      where: { id },
      data: { flagUrl: url },
    });
    res.json({ team: teamToJson(team) });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to upload team flag";
    res.status(500).json({ error: message });
  }
};

/** DELETE /api/admin/teams/:id */
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Team ID is required" });
      return;
    }
    await prisma.team.delete({ where: { id } });
    res.status(204).send();
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2003"
    ) {
      res.status(400).json({
        error: "Cannot delete team: it is used in one or more games.",
      });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to delete team";
    res.status(500).json({ error: message });
  }
};
