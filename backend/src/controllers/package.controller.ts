import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { nightsBetween } from "../utils/date.utils";
import { z } from "zod";

type PackageWithType = {
  id: string;
  name: string;
  typeId: string;
  duration: string;
  startDate: string | null;
  endDate: string | null;
  hostelPrice: unknown;
  hotelPrice: unknown;
  cityCount: number;
  includedItems: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: { id: string; name: string; code: string; displayOrder: number };
  packageGames?: Array<{
    game: {
      id: string;
      stadium: string;
      matchDate: string;
      displayOrder: number;
      team1: { id: string; name: string; flagUrl: string | null };
      team2: { id: string; name: string; flagUrl: string | null };
    };
  }>;
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
};

type GameWithTeams = {
  id: string;
  stadium: string;
  matchDate: string;
  displayOrder: number;
  team1: { id: string; name: string; flagUrl: string | null };
  team2: { id: string; name: string; flagUrl: string | null };
};

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

const getFeatureDefaults = (
  tier: "three_star" | "four_star",
  lineKey: string
): { title: string; description: string } | null => {
  const normalizedLineKey = lineKey.trim().toLowerCase();
  if (tier === "four_star") {
    return FOUR_STAR_FEATURE_BY_LINE_KEY[normalizedLineKey] ?? null;
  }
  return THREE_STAR_FEATURE_BY_LINE_KEY[normalizedLineKey] ?? null;
};

function serializePackage(
  pkg: PackageWithType,
  gamesByTypeId: Record<string, GameWithTeams[]>
) {
  const packageGames = pkg.packageGames ?? [];
  const games =
    packageGames.length > 0
      ? packageGames.map((pg) => ({
          id: pg.game.id,
          typeCode: pkg.type.code,
          stadium: pg.game.stadium ?? "",
          team1: {
            id: pg.game.team1.id,
            name: pg.game.team1.name,
            flagUrl: pg.game.team1.flagUrl ?? undefined,
          },
          team2: {
            id: pg.game.team2.id,
            name: pg.game.team2.name,
            flagUrl: pg.game.team2.flagUrl ?? undefined,
          },
          matchDate: pg.game.matchDate ?? "",
          displayOrder: pg.game.displayOrder ?? 0,
        }))
      : (gamesByTypeId[pkg.typeId] ?? []).map((g) => ({
          id: g.id,
          typeCode: pkg.type.code,
          stadium: g.stadium ?? "",
          team1: {
            id: g.team1.id,
            name: g.team1.name,
            flagUrl: g.team1.flagUrl ?? undefined,
          },
          team2: {
            id: g.team2.id,
            name: g.team2.name,
            flagUrl: g.team2.flagUrl ?? undefined,
          },
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
    threeStarHotelPrice: Number(pkg.hostelPrice),
    fourStarHotelPrice: Number(pkg.hotelPrice),
    cityCount: pkg.cityCount ?? 0,
    includedItems: pkg.includedItems ?? [],
    displayOrder: pkg.displayOrder,
    isActive: pkg.isActive,
    games,
    comparisonOptions:
      pkg.comparisonOptions?.map((option) => ({
        ...option,
        price: Number(option.price),
        roomLabel: option.roomLabel ?? undefined,
        imageUrl: option.imageUrl ?? undefined,
        ctaLabel: option.ctaLabel ?? undefined,
        features:
          option.features?.map((f) => ({
            ...f,
            title: getFeatureDefaults(option.tier, f.lineKey)?.title ?? f.title,
            description:
              getFeatureDefaults(option.tier, f.lineKey)?.description ??
              f.description ??
              undefined,
            iconKey: f.iconKey ?? undefined,
          })) ?? [],
      })) ?? [],
  };
}

/** GET /api/packages — list active packages with nested games (public, for booking/games) */
export const getPackages = async (_req: Request, res: Response) => {
  try {
    const [packages, allGames] = await Promise.all([
      prisma.bookingPackage.findMany({
        where: { isActive: true },
        include: {
          type: true,
          comparisonOptions: {
            orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
            include: { features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
          },
          packageGames: {
            include: {
              game: {
                include: { team1: true, team2: true },
              },
            },
          },
        },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      }),
      prisma.game.findMany({
        include: { team1: true, team2: true },
        orderBy: [{ displayOrder: "asc" }, { matchDate: "asc" }],
      }),
    ]);

    const gamesByTypeId = allGames.reduce<Record<string, GameWithTeams[]>>(
      (acc, g) => {
        if (!g.typeId) return acc;
        const list = acc[g.typeId] ?? [];
        list.push({
          id: g.id,
          stadium: g.stadium,
          team1: g.team1,
          team2: g.team2,
          matchDate: g.matchDate,
          displayOrder: g.displayOrder,
        });
        acc[g.typeId] = list;
        return acc;
      },
      {}
    );

    res.json({
      packages: packages.map((pkg) => serializePackage(pkg as PackageWithType, gamesByTypeId)),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch packages";
    res.status(500).json({ error: message });
  }
};

/** GET /api/packages/:id/comparison — package comparison rows aligned by lineKey */
export const getPackageComparison = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Package ID is required" });
      return;
    }

    const pkg = await prisma.bookingPackage.findUnique({
      where: { id },
      include: {
        type: true,
        packageGames: {
          include: { game: { include: { team1: true, team2: true } } },
        },
        comparisonOptions: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          include: { features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
        },
      },
    });

    if (!pkg || !pkg.isActive) {
      res.status(404).json({ error: "Package not found" });
      return;
    }

    const games = (pkg.packageGames ?? []).map((pg) => ({
      id: pg.game.id,
      typeCode: pkg.type.code,
      stadium: pg.game.stadium ?? "",
      team1: {
        id: pg.game.team1.id,
        name: pg.game.team1.name,
        flagUrl: pg.game.team1.flagUrl ?? undefined,
      },
      team2: {
        id: pg.game.team2.id,
        name: pg.game.team2.name,
        flagUrl: pg.game.team2.flagUrl ?? undefined,
      },
      matchDate: pg.game.matchDate ?? "",
      displayOrder: pg.game.displayOrder ?? 0,
    }));

    const optionByTier = {
      three_star: pkg.comparisonOptions.find((o) => o.tier === "three_star"),
      four_star: pkg.comparisonOptions.find((o) => o.tier === "four_star"),
    };

    const lineMap = new Map<
      string,
      {
        lineKey: string;
        displayOrder: number;
        left?: { title: string; description?: string; iconKey?: string };
        right?: { title: string; description?: string; iconKey?: string };
      }
    >();

    const putSide = (
      side: "left" | "right",
      features: Array<{
        lineKey: string;
        title: string;
        description: string | null;
        iconKey: string | null;
        displayOrder: number;
      }>
    ) => {
      features.forEach((f) => {
        const existing = lineMap.get(f.lineKey) ?? {
          lineKey: f.lineKey,
          displayOrder: f.displayOrder,
        };
        existing.displayOrder = Math.min(existing.displayOrder, f.displayOrder);
        existing[side] = {
          title:
            getFeatureDefaults(side === "left" ? "four_star" : "three_star", f.lineKey)
              ?.title ?? f.title,
          description:
            getFeatureDefaults(side === "left" ? "four_star" : "three_star", f.lineKey)
              ?.description ??
            f.description ??
            undefined,
          iconKey: f.iconKey ?? undefined,
        };
        lineMap.set(f.lineKey, existing);
      });
    };

    if (optionByTier.four_star) putSide("left", optionByTier.four_star.features);
    if (optionByTier.three_star) putSide("right", optionByTier.three_star.features);

    const comparisonRows = Array.from(lineMap.values()).sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    const nights = nightsBetween(pkg.startDate, pkg.endDate);

    res.json({
      package: {
        id: pkg.id,
        name: pkg.name,
        type: pkg.type.code,
        typeName: pkg.type.name,
        duration: pkg.duration,
        nights: nights ?? undefined,
        cityCount: pkg.cityCount ?? 0,
        includedItems: pkg.includedItems ?? [],
        games,
      },
      options: {
        fourStar: optionByTier.four_star
          ? {
              id: optionByTier.four_star.id,
              label: optionByTier.four_star.label,
              price: Number(optionByTier.four_star.price),
              roomLabel: optionByTier.four_star.roomLabel ?? undefined,
              imageUrl: optionByTier.four_star.imageUrl ?? undefined,
              ctaLabel: optionByTier.four_star.ctaLabel ?? undefined,
            }
          : null,
        threeStar: optionByTier.three_star
          ? {
              id: optionByTier.three_star.id,
              label: optionByTier.three_star.label,
              price: Number(optionByTier.three_star.price),
              roomLabel: optionByTier.three_star.roomLabel ?? undefined,
              imageUrl: optionByTier.three_star.imageUrl ?? undefined,
              ctaLabel: optionByTier.three_star.ctaLabel ?? undefined,
            }
          : null,
      },
      comparisonRows,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch package comparison";
    res.status(500).json({ error: message });
  }
};

const compareOptionsQuerySchema = z
  .object({
    leftOptionId: z.string().uuid().optional(),
    rightOptionId: z.string().uuid().optional(),
    leftPackageId: z.string().uuid().optional(),
    rightPackageId: z.string().uuid().optional(),
    leftTier: z.enum(["three_star", "four_star"]).optional(),
    rightTier: z.enum(["three_star", "four_star"]).optional(),
  })
  .refine(
    (q) => Boolean(q.leftOptionId) || (Boolean(q.leftPackageId) && Boolean(q.leftTier)),
    { message: "Provide either leftOptionId or leftPackageId+leftTier" }
  )
  .refine(
    (q) => Boolean(q.rightOptionId) || (Boolean(q.rightPackageId) && Boolean(q.rightTier)),
    { message: "Provide either rightOptionId or rightPackageId+rightTier" }
  );

type ComparisonOptionWithPackage = {
  id: string;
  packageId: string;
  tier: "three_star" | "four_star";
  label: string;
  price: unknown;
  roomLabel: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  displayOrder: number;
  features: Array<{
    lineKey: string;
    title: string;
    description: string | null;
    iconKey: string | null;
    displayOrder: number;
  }>;
  package: {
    id: string;
    name: string;
    type: { code: string; name: string };
    duration: string;
    startDate: string | null;
    endDate: string | null;
    cityCount: number;
    includedItems: string[];
    packageGames: Array<{
      game: {
        id: string;
        stadium: string;
        matchDate: string;
        displayOrder: number;
        team1: { id: string; name: string; flagUrl: string | null };
        team2: { id: string; name: string; flagUrl: string | null };
      };
    }>;
  };
};

function serializeComparisonOption(option: ComparisonOptionWithPackage) {
  const nights = nightsBetween(option.package.startDate, option.package.endDate);
  const games = (option.package.packageGames ?? []).map((pg) => ({
    id: pg.game.id,
    typeCode: option.package.type.code,
    stadium: pg.game.stadium ?? "",
    team1: {
      id: pg.game.team1.id,
      name: pg.game.team1.name,
      flagUrl: pg.game.team1.flagUrl ?? undefined,
    },
    team2: {
      id: pg.game.team2.id,
      name: pg.game.team2.name,
      flagUrl: pg.game.team2.flagUrl ?? undefined,
    },
    matchDate: pg.game.matchDate ?? "",
    displayOrder: pg.game.displayOrder ?? 0,
  }));

  return {
    id: option.id,
    packageId: option.packageId,
    packageName: option.package.name,
    packageTypeName: option.package.type.name,
    packageTypeCode: option.package.type.code,
    tier: option.tier,
    label: option.label,
    price: Number(option.price),
    roomLabel: option.roomLabel ?? undefined,
    imageUrl: option.imageUrl ?? undefined,
    ctaLabel: option.ctaLabel ?? undefined,
    duration: option.package.duration,
    nights: nights ?? undefined,
    cityCount: option.package.cityCount ?? 0,
    includedItems: option.package.includedItems ?? [],
    games,
  };
}

/**
 * GET /api/packages/comparison
 * Compare any two package options, including across different packages.
 * Query:
 *   - leftOptionId/rightOptionId, OR
 *   - leftPackageId+leftTier and rightPackageId+rightTier
 */
export const comparePackageOptions = async (req: Request, res: Response) => {
  try {
    const parsed = compareOptionsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join("; ");
      res.status(400).json({ error: msg });
      return;
    }

    const q = parsed.data;

    const resolveOption = async (
      optionId: string | undefined,
      packageId: string | undefined,
      tier: "three_star" | "four_star" | undefined
    ) => {
      if (optionId) {
        return prisma.bookingPackageOption.findUnique({
          where: { id: optionId },
          include: {
            features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
            package: {
              include: {
                type: true,
                packageGames: {
                  include: {
                    game: { include: { team1: true, team2: true } },
                  },
                },
              },
            },
          },
        });
      }
      return prisma.bookingPackageOption.findFirst({
        where: {
          packageId: packageId!,
          tier: tier!,
          package: { isActive: true },
        },
        include: {
          features: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
          package: {
            include: {
              type: true,
              packageGames: {
                include: {
                  game: { include: { team1: true, team2: true } },
                },
              },
            },
          },
        },
      });
    };

    const [left, right] = await Promise.all([
      resolveOption(q.leftOptionId, q.leftPackageId, q.leftTier),
      resolveOption(q.rightOptionId, q.rightPackageId, q.rightTier),
    ]);

    if (!left || !left.package.isActive) {
      res.status(404).json({ error: "Left comparison option not found" });
      return;
    }
    if (!right || !right.package.isActive) {
      res.status(404).json({ error: "Right comparison option not found" });
      return;
    }

    const lineMap = new Map<
      string,
      {
        lineKey: string;
        displayOrder: number;
        left?: { title: string; description?: string; iconKey?: string };
        right?: { title: string; description?: string; iconKey?: string };
      }
    >();

    const putSide = (
      side: "left" | "right",
      features: Array<{
        lineKey: string;
        title: string;
        description: string | null;
        iconKey: string | null;
        displayOrder: number;
      }>
    ) => {
      features.forEach((f) => {
        const existing = lineMap.get(f.lineKey) ?? {
          lineKey: f.lineKey,
          displayOrder: f.displayOrder,
        };
        existing.displayOrder = Math.min(existing.displayOrder, f.displayOrder);
        existing[side] = {
          title:
            getFeatureDefaults(side === "left" ? left.tier : right.tier, f.lineKey)
              ?.title ?? f.title,
          description:
            getFeatureDefaults(side === "left" ? left.tier : right.tier, f.lineKey)
              ?.description ??
            f.description ??
            undefined,
          iconKey: f.iconKey ?? undefined,
        };
        lineMap.set(f.lineKey, existing);
      });
    };

    putSide("left", left.features);
    putSide("right", right.features);

    const comparisonRows = Array.from(lineMap.values()).sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    res.json({
      left: serializeComparisonOption(left as unknown as ComparisonOptionWithPackage),
      right: serializeComparisonOption(right as unknown as ComparisonOptionWithPackage),
      comparisonRows,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to compare package options";
    res.status(500).json({ error: message });
  }
};
