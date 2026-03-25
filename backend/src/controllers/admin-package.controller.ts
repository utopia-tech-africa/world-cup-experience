import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { z } from "zod";
import { nightsBetween } from "../utils/date.utils";

const comparisonFeatureSchema = z.object({
  lineKey: z.string().min(1, "Feature lineKey is required"),
  title: z.string().min(1, "Feature title is required"),
  description: z.string().optional(),
  iconKey: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
});

const comparisonOptionSchema = z.object({
  tier: z.enum(["three_star", "four_star"]),
  label: z.string().min(1, "Option label is required"),
  price: z.number().positive("Option price must be positive"),
  roomLabel: z.string().optional(),
  imageUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
  features: z.array(comparisonFeatureSchema).default([]),
});

const createPackageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  typeId: z.string().uuid("Invalid type ID"),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  hostelPrice: z.number().positive("Hostel price must be positive"),
  hotelPrice: z.number().positive("Hotel price must be positive"),
  cityCount: z.number().int().min(0).default(0),
  includedItems: z.array(z.string().min(1)).default([]),
  comparisonOptions: z.array(comparisonOptionSchema).optional().default([]),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().optional().default(true),
  gameIds: z.array(z.string().uuid()).optional().default([]),
}).refine(
  (data) => data.duration?.trim() || (data.startDate?.trim() && data.endDate?.trim()),
  { message: "Either duration or both startDate and endDate are required", path: ["duration"] }
);

const FOUR_STAR_FEATURE_BY_LINE_KEY: Record<string, { title: string; description: string }> = {
  accommodation: {
    title: "Upscale Luxury",
    description:
      "Luxury 4-Star accommodation with enhanced comfort and premium modern amenities.",
  },
  row_1: {
    title: "Upscale Luxury",
    description:
      "Luxury 4-Star accommodation with enhanced comfort and premium modern amenities.",
  },
  proximity: {
    title: "15 Min to Venue",
    description:
      "Unbeatable proximity to match venues, saving you valuable time on game day.",
  },
  row_2: {
    title: "15 Min to Venue",
    description:
      "Unbeatable proximity to match venues, saving you valuable time on game day.",
  },
  support: {
    title: "24hr Room Service",
    description:
      "Dedicated lifestyle manager for restaurant bookings, city tours, and personal errands.",
  },
  row_3: {
    title: "24hr Room Service",
    description:
      "Dedicated lifestyle manager for restaurant bookings, city tours, and personal errands.",
  },
  location: {
    title: "Prime City Access",
    description:
      "Direct access to major shopping, high-end dining, and Qatar's historic sites.",
  },
  row_4: {
    title: "Prime City Access",
    description:
      "Direct access to major shopping, high-end dining, and Qatar's historic sites.",
  },
  gifts: {
    title: "Official Merchandise Kit",
    description:
      "Premium collection including official jersey, leather scarf, and match-ball replica.",
  },
  row_5: {
    title: "Official Merchandise Kit",
    description:
      "Premium collection including official jersey, leather scarf, and match-ball replica.",
  },
};

const THREE_STAR_FEATURE_BY_LINE_KEY: Record<string, { title: string; description: string }> = {
  accommodation: {
    title: "Standard Comfort",
    description:
      "Daily premium buffet breakfast to start your match day with localized delicacies.",
  },
  row_1: {
    title: "Standard Comfort",
    description:
      "Daily premium buffet breakfast to start your match day with localized delicacies.",
  },
  proximity: {
    title: "35 Min to Venue",
    description:
      "Reliable transport with a standard commute time to the tournament stadium.",
  },
  row_2: {
    title: "35 Min to Venue",
    description:
      "Reliable transport with a standard commute time to the tournament stadium.",
  },
  support: {
    title: "24hr Room Service",
    description:
      "Centralized digital support desk for logistics and tournament-related queries",
  },
  row_3: {
    title: "24hr Room Service",
    description:
      "Centralized digital support desk for logistics and tournament-related queries",
  },
  location: {
    title: "Strategic Location",
    description:
      "Conveniently located with easy public transit links to the city center.",
  },
  row_4: {
    title: "Strategic Location",
    description:
      "Conveniently located with easy public transit links to the city center.",
  },
  gifts: {
    title: "Commemorative Pin",
    description:
      "Limited edition tournament lapel pin and official welcome lanyard.",
  },
  row_5: {
    title: "Commemorative Pin",
    description:
      "Limited edition tournament lapel pin and official welcome lanyard.",
  },
};

type ParsedPackageInput = z.infer<typeof createPackageSchema>;

const withTierDescriptionDefaults = (
  options: ParsedPackageInput["comparisonOptions"]
): ParsedPackageInput["comparisonOptions"] =>
  options.map((option) => {
    const descriptionMap =
      option.tier === "four_star"
        ? FOUR_STAR_FEATURE_BY_LINE_KEY
        : THREE_STAR_FEATURE_BY_LINE_KEY;

    return {
      ...option,
      features: option.features.map((feature) => {
        const normalizedLineKey = feature.lineKey.trim().toLowerCase();
        return {
          ...feature,
          title: descriptionMap[normalizedLineKey]?.title ?? feature.title,
          description: descriptionMap[normalizedLineKey]?.description ?? feature.description,
        };
      }),
    };
  });

function serializePackage(pkg: {
  id: string;
  name: string;
  typeId: string;
  duration: string;
  startDate?: string | null;
  endDate?: string | null;
  hostelPrice: unknown;
  hotelPrice: unknown;
  cityCount: number;
  includedItems: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  type?: { id: string; name: string; code: string; displayOrder: number } | null;
  packageGames?: Array<{ gameId: string }>;
  comparisonOptions?: Array<{
    id: string;
    tier: "three_star" | "four_star";
    label: string;
    price: unknown;
    roomLabel?: string | null;
    imageUrl?: string | null;
    ctaLabel?: string | null;
    displayOrder: number;
    features?: Array<{
      id: string;
      lineKey: string;
      title: string;
      description?: string | null;
      iconKey?: string | null;
      displayOrder: number;
    }>;
  }>;
}) {
  const { type, packageGames, comparisonOptions, ...rest } = pkg;
  const nights = nightsBetween(pkg.startDate ?? null, pkg.endDate ?? null);
  return {
    ...rest,
    hostelPrice: Number(pkg.hostelPrice),
    hotelPrice: Number(pkg.hotelPrice),
    threeStarHotelPrice: Number(pkg.hostelPrice),
    fourStarHotelPrice: Number(pkg.hotelPrice),
    cityCount: pkg.cityCount,
    includedItems: pkg.includedItems ?? [],
    startDate: pkg.startDate ?? undefined,
    endDate: pkg.endDate ?? undefined,
    nights: nights ?? undefined,
    type: type
      ? { id: type.id, name: type.name, code: type.code, displayOrder: type.displayOrder }
      : undefined,
    gameIds: packageGames?.map((pg) => pg.gameId) ?? [],
    comparisonOptions:
      comparisonOptions?.map((option) => ({
        ...option,
        price: Number(option.price),
        roomLabel: option.roomLabel ?? undefined,
        imageUrl: option.imageUrl ?? undefined,
        ctaLabel: option.ctaLabel ?? undefined,
        features:
          option.features?.map((f) => ({
            ...f,
            description: f.description ?? undefined,
            iconKey: f.iconKey ?? undefined,
          })) ?? [],
      })) ?? [],
  };
}

/** GET /api/admin/packages — list all packages (including inactive) with gameIds */
export const getAdminPackages = async (_req: Request, res: Response) => {
  try {
    const packages = await prisma.bookingPackage.findMany({
      include: {
        type: true,
        packageGames: { select: { gameId: true } },
        comparisonOptions: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          include: { features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
        },
      },
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
      cityCount,
      includedItems,
      comparisonOptions,
      displayOrder,
      isActive,
      gameIds,
    } = parsed.data;
    const normalizedComparisonOptions =
      withTierDescriptionDefaults(comparisonOptions);
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
        cityCount,
        includedItems,
        comparisonOptions: {
          create: normalizedComparisonOptions.map((option) => ({
            tier: option.tier,
            label: option.label,
            price: option.price,
            roomLabel: option.roomLabel?.trim() || null,
            imageUrl: option.imageUrl?.trim() || null,
            ctaLabel: option.ctaLabel?.trim() || null,
            displayOrder: option.displayOrder,
            features: {
              create: option.features.map((feature) => ({
                lineKey: feature.lineKey.trim(),
                title: feature.title.trim(),
                description: feature.description?.trim() || null,
                iconKey: feature.iconKey?.trim() || null,
                displayOrder: feature.displayOrder,
              })),
            },
          })),
        },
        displayOrder,
        isActive,
      },
      include: {
        type: true,
        packageGames: { select: { gameId: true } },
        comparisonOptions: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          include: { features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
        },
      },
    });
    if (gameIdsToLink.length > 0) {
      await prisma.bookingPackageGame.createMany({
        data: gameIdsToLink.map((gameId) => ({ packageId: pkg.id, gameId })),
      });
    }
    const withGames = await prisma.bookingPackage.findUnique({
      where: { id: pkg.id },
      include: {
        type: true,
        packageGames: { select: { gameId: true } },
        comparisonOptions: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          include: { features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
        },
      },
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
      cityCount,
      includedItems,
      comparisonOptions,
      displayOrder,
      isActive,
      gameIds,
    } = parsed.data;
    const normalizedComparisonOptions =
      withTierDescriptionDefaults(comparisonOptions);
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
    await prisma.bookingPackageOptionFeature.deleteMany({
      where: { option: { packageId: id } },
    });
    await prisma.bookingPackageOption.deleteMany({ where: { packageId: id } });
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
        cityCount,
        includedItems,
        comparisonOptions: {
          create: normalizedComparisonOptions.map((option) => ({
            tier: option.tier,
            label: option.label,
            price: option.price,
            roomLabel: option.roomLabel?.trim() || null,
            imageUrl: option.imageUrl?.trim() || null,
            ctaLabel: option.ctaLabel?.trim() || null,
            displayOrder: option.displayOrder,
            features: {
              create: option.features.map((feature) => ({
                lineKey: feature.lineKey.trim(),
                title: feature.title.trim(),
                description: feature.description?.trim() || null,
                iconKey: feature.iconKey?.trim() || null,
                displayOrder: feature.displayOrder,
              })),
            },
          })),
        },
        displayOrder,
        isActive,
      },
      include: {
        type: true,
        packageGames: { select: { gameId: true } },
        comparisonOptions: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          include: { features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
        },
      },
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
