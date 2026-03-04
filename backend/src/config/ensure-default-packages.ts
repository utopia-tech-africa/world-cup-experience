import { prisma } from "./database.config";

const DEFAULT_PACKAGES = [
  {
    name: "One Game",
    typeCode: "single_game",
    duration: "4 nights (June 25-29)",
    hostelPrice: 1000,
    hotelPrice: 1800,
    displayOrder: 0,
  },
  {
    name: "Double Game",
    typeCode: "double_game",
    duration: "7 nights (June 22-29)",
    hostelPrice: 1500,
    hotelPrice: 3000,
    displayOrder: 1,
  },
];

/**
 * Ensures at least the two default packages exist. Safe to run on every startup.
 * Depends on package types existing (run ensureDefaultPackageTypes first).
 */
export async function ensureDefaultPackages(): Promise<void> {
  try {
    const count = await prisma.bookingPackage.count();
    if (count > 0) return;

    for (const p of DEFAULT_PACKAGES) {
      const type = await prisma.packageType.findUnique({
        where: { code: p.typeCode },
      });
      if (!type) continue;
      await prisma.bookingPackage.create({
        data: {
          name: p.name,
          typeId: type.id,
          duration: p.duration,
          hostelPrice: p.hostelPrice,
          hotelPrice: p.hotelPrice,
          displayOrder: p.displayOrder,
          isActive: true,
        },
      });
    }
    console.log("Default packages ensured (One Game, Double Game).");
  } catch (err) {
    console.error("Failed to ensure default packages:", err);
  }
}
