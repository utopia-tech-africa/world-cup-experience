import { prisma } from "../src/config/database.config";

const featureByLineKey: Record<string, { title: string; description: string }> = {
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

async function run() {
  const options = await prisma.bookingPackageOption.findMany({
    where: { tier: "four_star" },
    select: { id: true },
  });
  const optionIds = options.map((option) => option.id);

  if (optionIds.length === 0) {
    console.log("No four_star package options found.");
    return;
  }

  let totalUpdated = 0;
  for (const [lineKey, feature] of Object.entries(featureByLineKey)) {
    const { count } = await prisma.bookingPackageOptionFeature.updateMany({
      where: {
        optionId: { in: optionIds },
        lineKey,
      },
      data: { title: feature.title, description: feature.description },
    });
    totalUpdated += count;
    console.log(`${lineKey}: ${count} row(s) updated`);
  }

  console.log(`Total rows updated: ${totalUpdated}`);
}

run()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

