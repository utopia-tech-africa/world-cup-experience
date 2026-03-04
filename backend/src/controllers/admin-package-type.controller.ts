import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { z } from "zod";

/** PrismaClient with adapter may omit delegate types; assert delegates exist at runtime. */
type PackageTypeDelegate = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique: (args: unknown) => Promise<unknown>;
  findFirst: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};
type BookingPackageDelegate = { count: (args: unknown) => Promise<number> };
const db = prisma as unknown as { packageType: PackageTypeDelegate; bookingPackage: BookingPackageDelegate };
const packageType = db.packageType;

/** Generate code from name: lowercase, spaces → underscores, strip invalid chars. */
export function nameToCode(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

const createTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
});

/** GET /api/admin/package-types — list all package types */
export const getAdminPackageTypes = async (_req: Request, res: Response) => {
  try {
    const types = await packageType.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    res.json({ types });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch package types";
    res.status(500).json({ error: message });
  }
};

/** POST /api/admin/package-types — create package type */
export const createPackageType = async (req: Request, res: Response) => {
  try {
    const parsed = createTypeSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const { name, code, displayOrder } = parsed.data;
    const finalCode = code?.trim() || nameToCode(name);
    if (!finalCode) {
      res.status(400).json({ error: "Code could not be generated from name; use letters, numbers or spaces only" });
      return;
    }
    if (!/^[a-z0-9_]+$/.test(finalCode)) {
      res.status(400).json({ error: "Code must be lowercase letters, numbers and underscores only" });
      return;
    }
    const existing = await packageType.findUnique({ where: { code: finalCode } });
    if (existing) {
      res.status(400).json({ error: "A type with this code already exists" });
      return;
    }
    const type = await packageType.create({
      data: { name, code: finalCode, displayOrder },
    });
    res.status(201).json({ type });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create package type";
    res.status(500).json({ error: message });
  }
};

/** PATCH /api/admin/package-types/:id — update package type */
export const updatePackageType = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Package type ID is required" });
      return;
    }
    const parsed = createTypeSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join("; ");
      res.status(400).json({ error: msg });
      return;
    }
    const { name, code, displayOrder } = parsed.data;
    const finalCode = code?.trim() || nameToCode(name);
    if (!finalCode) {
      res.status(400).json({ error: "Code could not be generated from name; use letters, numbers or spaces only" });
      return;
    }
    if (!/^[a-z0-9_]+$/.test(finalCode)) {
      res.status(400).json({ error: "Code must be lowercase letters, numbers and underscores only" });
      return;
    }
    const existing = await packageType.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Package type not found" });
      return;
    }
    const duplicateCode = await packageType.findFirst({
      where: { code: finalCode, id: { not: id } },
    });
    if (duplicateCode) {
      res.status(400).json({ error: "A type with this code already exists" });
      return;
    }
    const type = await packageType.update({
      where: { id },
      data: { name, code: finalCode, displayOrder },
    });
    res.json({ type });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Package type not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to update package type";
    res.status(500).json({ error: message });
  }
};

/** DELETE /api/admin/package-types/:id — delete package type (only if no packages use it) */
export const deletePackageType = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Package type ID is required" });
      return;
    }
    const packagesCount = await db.bookingPackage.count({
      where: { typeId: id },
    });
    if (packagesCount > 0) {
      res.status(400).json({
        error: `Cannot delete: ${packagesCount} package(s) use this type. Remove or reassign them first.`,
      });
      return;
    }
    await packageType.delete({ where: { id } });
    res.status(204).send();
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      res.status(404).json({ error: "Package type not found" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to delete package type";
    res.status(500).json({ error: message });
  }
};
