import { prisma } from "../src/config/database.config";

const featureByLineKey: Record<string, { title: string; description: string }> = {
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

async function run() {
  const options = await prisma.bookingPackageOption.findMany({
    where: { tier: "three_star" },
    select: { id: true },
  });
  const optionIds = options.map((option) => option.id);

  if (optionIds.length === 0) {
    console.log("No three_star package options found.");
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

