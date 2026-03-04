import { prisma } from "./database.config";

const DEFAULT_TYPES = [
  { name: "Single game", code: "single_game", displayOrder: 0 },
  { name: "Double game", code: "double_game", displayOrder: 1 },
  { name: "Triple game", code: "triple_game", displayOrder: 2 },
  { name: "Quad game", code: "quad_game", displayOrder: 3 },
];

/**
 * Ensures default package types exist. Safe to run on every startup.
 */
export async function ensureDefaultPackageTypes(): Promise<void> {
  try {
    for (const t of DEFAULT_TYPES) {
      await prisma.packageType.upsert({
        where: { code: t.code },
        create: t,
        update: { name: t.name, displayOrder: t.displayOrder },
      });
    }
  } catch (err) {
    console.error("Failed to ensure default package types:", err);
  }
}
