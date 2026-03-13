import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { z } from "zod";
import { nightsBetween } from "../utils/date.utils";

const createPackageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  typeId: z.string().uuid("Invalid type ID"),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  hostelPrice: z.number().positive("Hostel price must be positive"),
  hotelPrice: z.number().positive("Hotel price must be positive"),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().optional().default(true),
  gameIds: z.array(z.string().uuid()).optional().default([]),
}).refine(
  (data) => data.duration?.trim() || (data.startDate?.trim() && data.endDate?.trim()),
  { message: "Either duration or both startDate and endDate are required", path: ["duration"] }
);

function serializePackage(pkg: {
  id: string;
  name: string;
  typeId: string;
  duration: string;
  startDate?: string | null;
  endDate?: string | null;
  hostelPrice: unknown;
  hotelPrice: unknown;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  type?: { id: string; name: string; code: string; displayOrder: number } | null;
  packageGames?: Array<{ gameId: string }>;
}) {
  const { type, packageGames, ...rest } = pkg;
  const nights = nightsBetween(pkg.startDate ?? null, pkg.endDate ?? null);
  return {
    ...rest,
    hostelPrice: Number(pkg.hostelPrice),
    hotelPrice: Number(pkg.hotelPrice),
    startDate: pkg.startDate ?? undefined,
    endDate: pkg.endDate ?? undefined,
    nights: nights ?? undefined,
    type: type
      ? { id: type.id, name: type.name, code: type.code, displayOrder: type.displayOrder }
      : undefined,
    gameIds: packageGames?.map((pg) => pg.gameId) ?? [],
  };
}

/** GET /api/admin/packages — list all packages (including inactive) with gameIds */
export const getAdminPackages = async (_req: Request, res: Response) => {
  try {
    const packages = await prisma.bookingPackage.findMany({
      include: { type: true, packageGames: { select: { gameId: true } } },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    res.json({ packages: packages.map(serializePackage) });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch packages";
    res.status(500).json({ error: message });
  }
};

/** POST /api/admin/packages — create package */
export const createPackage = async (req: Request, res: Response) => {
  try {
    const parsed = createPackageSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const {
      name,
      typeId,
      duration,
      startDate,
      endDate,
      hostelPrice,
      hotelPrice,
      displayOrder,
      isActive,
      gameIds,
    } = parsed.data;
    const typeExists = await prisma.packageType.findUnique({
      where: { id: typeId },
    });
    if (!typeExists) {
      res.status(400).json({ error: "Invalid package type" });
      return;
    }
    const gameIdsToLink = gameIds ?? [];
    if (gameIdsToLink.length > 0) {
      const existingGames = await prisma.game.findMany({
        where: { id: { in: gameIdsToLink } },
        select: { id: true },
      });
      const foundIds = new Set(existingGames.map((g) => g.id));
      const invalid = gameIdsToLink.filter((id) => !foundIds.has(id));
      if (invalid.length > 0) {
        res.status(400).json({ error: "Invalid game ID(s): " + invalid.join(", ") });
        return;
      }
    }
    const nights = nightsBetween(startDate ?? null, endDate ?? null);
    const plural = nights !== 1 ? "s" : "";
    const durationText =
      duration?.trim() ||
      (nights != null ? `${nights} night${plural}` : "—");
    const pkg = await prisma.bookingPackage.create({
      data: {
        name,
        typeId,
        duration: durationText,
        startDate: startDate?.trim() || null,
        endDate: endDate?.trim() || null,
        hostelPrice,
        hotelPrice,
        displayOrder,
        isActive,
      },
      include: { type: true, packageGames: { select: { gameId: true } } },
    });
    if (gameIdsToLink.length > 0) {
      await prisma.bookingPackageGame.createMany({
        data: gameIdsToLink.map((gameId) => ({ packageId: pkg.id, gameId })),
      });
    }
    const withGames = await prisma.bookingPackage.findUnique({
      where: { id: pkg.id },
      include: { type: true, packageGames: { select: { gameId: true } } },
    });
    res.status(201).json({ package: serializePackage(withGames!) });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create package";
    res.status(500).json({ error: message });
  }
};

/** PATCH /api/admin/packages/:id — update package */
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Package ID is required" });
      return;
    }
    const parsed = createPackageSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const {
      name,
      typeId,
      duration,
      startDate,
      endDate,
      hostelPrice,
      hotelPrice,
      displayOrder,
      isActive,
      gameIds,
    } = parsed.data;
    const typeExists = await prisma.packageType.findUnique({
      where: { id: typeId },
    });
    if (!typeExists) {
      res.status(400).json({ error: "Invalid package type" });
      return;
    }
    const gameIdsToLink = gameIds ?? [];
    if (gameIdsToLink.length > 0) {
      const existingGames = await prisma.game.findMany({
        where: { id: { in: gameIdsToLink } },
        select: { id: true },
      });
      const foundIds = new Set(existingGames.map((g) => g.id));
      const invalid = gameIdsToLink.filter((id) => !foundIds.has(id));
      if (invalid.length > 0) {
        res.status(400).json({ error: "Invalid game ID(s): " + invalid.join(", ") });
        return;
      }
    }
    const nights = nightsBetween(startDate ?? null, endDate ?? null);
    const plural = nights !== 1 ? "s" : "";
    const durationText =
      duration?.trim() ||
      (nights != null ? `${nights} night${plural}` : null) ||
      "—";
    await prisma.bookingPackageGame.deleteMany({ where: { packageId: id } });
    if (gameIdsToLink.length > 0) {
      await prisma.bookingPackageGame.createMany({
        data: gameIdsToLink.map((gameId) => ({ packageId: id, gameId })),
      });
    }
    const pkg = await prisma.bookingPackage.update({
      where: { id },
      data: {
        name,
        typeId,
        duration: durationText,
        startDate: startDate?.trim() || null,
        endDate: endDate?.trim() || null,
        hostelPrice,
        hotelPrice,
        displayOrder,
        isActive,
      },
      include: { type: true, packageGames: { select: { gameId: true } } },
    });
    res.json({ package: serializePackage(pkg) });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to update package";
    res.status(500).json({ error: message });
  }
};

/** DELETE /api/admin/packages/:id — delete package (and its package_games links via cascade) */
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Package ID is required" });
      return;
    }
    await prisma.bookingPackage.delete({ where: { id } });
    res.status(204).send();
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to delete package";
    res.status(500).json({ error: message });
  }
};
