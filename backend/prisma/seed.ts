/// <reference types="node" />
import "dotenv/config";
import { prisma } from "../src/config/database.config";
import { hashPassword } from "../src/utils/password.utils";

function bookingReference(seq: number): string {
  return `WC-2026-${String(seq).padStart(4, "0")}`;
}

async function main() {
  // Clear existing data (order respects foreign keys)
  await prisma.bookingAddOn.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await hashPassword(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@altairlogistics.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@altairlogistics.com",
      passwordHash: hashedPassword,
      fullName: process.env.ADMIN_NAME || "Admin User",
      role: "admin",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create add-ons
  const addons = [
    {
      name: "Merch Bundle",
      description: "Official scarf, cap, and flag kit",
      price: 50.0,
      category: "merch" as const,
      displayOrder: 1,
    },
    {
      name: "PHL Airport Shuttle",
      description: "Round trip airport shuttle service",
      price: 75.0,
      category: "transport" as const,
      displayOrder: 2,
    },
    {
      name: "Premium Match-Day Priority Transfers",
      description: "Priority transfers on match days",
      price: 100.0,
      category: "transport" as const,
      displayOrder: 3,
    },
    {
      name: "Private Delegation SUV",
      description: "Private SUV for delegation",
      price: 200.0,
      category: "transport" as const,
      displayOrder: 4,
    },
    {
      name: "Lunch/Dinner Meal Add-on",
      description: "Meal package for lunch and dinner",
      price: 80.0,
      category: "food" as const,
      displayOrder: 5,
    },
  ];

  for (const addon of addons) {
    const existing = await prisma.addOn.findFirst({
      where: { name: addon.name },
    });

    if (existing) {
      await prisma.addOn.update({
        where: { id: existing.id },
        data: addon,
      });
    } else {
      await prisma.addOn.create({
        data: addon,
      });
    }
  }

  console.log("Created add-ons:", addons.length);

  // Seed bookings (upsert by bookingReference so re-run is idempotent)
  const addonList = await prisma.addOn.findMany({
    orderBy: { displayOrder: "asc" },
  });
  const merchAddon = addonList.find((a) => a.category === "merch");
  const transportAddon = addonList.find(
    (a) => a.name === "PHL Airport Shuttle",
  );
  const foodAddon = addonList.find((a) => a.category === "food");

  const bookingSeeds = [
    {
      bookingReference: bookingReference(1),
      fullName: "James Mitchell",
      email: "james.mitchell@example.com",
      phone: "+1-555-0101",
      passportNumber: "AB1234567",
      passportExpiry: new Date("2028-06-15"),
      packageType: "single_game" as const,
      accommodationType: "hotel" as const,
      numberOfTravelers: 2,
      specialRequests: "Window seat preferred",
      paymentAccountType: "international" as const,
      basePackagePrice: 1200,
      addonsTotalPrice: 125,
      totalAmount: 1325,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-1.pdf",
      bookingStatus: "pending" as const,
      addonNames: ["Merch Bundle", "PHL Airport Shuttle"],
    },
    {
      bookingReference: bookingReference(2),
      fullName: "Sarah Chen",
      email: "sarah.chen@example.com",
      phone: "+1-555-0102",
      passportNumber: "CD9876543",
      passportExpiry: new Date("2027-12-01"),
      packageType: "double_game" as const,
      accommodationType: "hotel" as const,
      numberOfTravelers: 4,
      paymentAccountType: "local" as const,
      basePackagePrice: 4800,
      addonsTotalPrice: 350,
      totalAmount: 5150,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-2.pdf",
      bookingStatus: "confirmed" as const,
      confirmedAt: new Date(),
      confirmedBy: admin.id,
      addonNames: [
        "Merch Bundle",
        "PHL Airport Shuttle",
        "Lunch/Dinner Meal Add-on",
      ],
    },
    {
      bookingReference: bookingReference(3),
      fullName: "Marcus Johnson",
      email: "marcus.j@example.com",
      phone: "+1-555-0103",
      passportNumber: "EF5554444",
      passportExpiry: new Date("2029-03-20"),
      packageType: "single_game" as const,
      accommodationType: "hostel" as const,
      numberOfTravelers: 1,
      paymentAccountType: "international" as const,
      basePackagePrice: 650,
      addonsTotalPrice: 50,
      totalAmount: 700,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-3.pdf",
      bookingStatus: "rejected" as const,
      rejectionReason: "Passport expiry too close to travel date.",
      addonNames: ["Merch Bundle"],
    },
    {
      bookingReference: bookingReference(4),
      fullName: "Elena Rodriguez",
      email: "elena.r@example.com",
      phone: "+1-555-0104",
      passportNumber: "GH1112222",
      passportExpiry: new Date("2030-01-10"),
      packageType: "double_game" as const,
      accommodationType: "hotel" as const,
      numberOfTravelers: 2,
      specialRequests: "Vegetarian meals",
      paymentAccountType: "international" as const,
      basePackagePrice: 2400,
      addonsTotalPrice: 280,
      totalAmount: 2680,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-4.pdf",
      bookingStatus: "pending" as const,
      addonNames: [
        "Merch Bundle",
        "PHL Airport Shuttle",
        "Lunch/Dinner Meal Add-on",
      ],
    },
    {
      bookingReference: bookingReference(5),
      fullName: "David Kim",
      email: "david.kim@example.com",
      phone: "+1-555-0105",
      passportNumber: "IJ3334444",
      passportExpiry: new Date("2028-09-05"),
      packageType: "single_game" as const,
      accommodationType: "hostel" as const,
      numberOfTravelers: 3,
      paymentAccountType: "local" as const,
      basePackagePrice: 1950,
      addonsTotalPrice: 0,
      totalAmount: 1950,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-5.pdf",
      bookingStatus: "confirmed" as const,
      confirmedAt: new Date(Date.now() - 86400000 * 2),
      confirmedBy: admin.id,
      addonNames: [] as string[],
    },
    {
      bookingReference: bookingReference(6),
      fullName: "Salim Jamal",
      email: "jamalsalim.js12@gmail.com",
      phone: "+1-555-0106",
      passportNumber: "KL6667777",
      passportExpiry: new Date("2027-11-30"),
      packageType: "single_game" as const,
      accommodationType: "hotel" as const,
      numberOfTravelers: 1,
      paymentAccountType: "international" as const,
      basePackagePrice: 1200,
      addonsTotalPrice: 200,
      totalAmount: 1400,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-6.pdf",
      bookingStatus: "pending" as const,
      addonNames: [
        "PHL Airport Shuttle",
        "Premium Match-Day Priority Transfers",
      ],
    },
    {
      bookingReference: bookingReference(7),
      fullName: "Ahmed Hassan",
      email: "ahmed.h@example.com",
      phone: "+1-555-0107",
      passportNumber: "MN8889999",
      passportExpiry: new Date("2029-07-15"),
      packageType: "double_game" as const,
      accommodationType: "hotel" as const,
      numberOfTravelers: 6,
      specialRequests: "Group seating",
      paymentAccountType: "international" as const,
      basePackagePrice: 7200,
      addonsTotalPrice: 600,
      totalAmount: 7800,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-7.pdf",
      bookingStatus: "confirmed" as const,
      confirmedAt: new Date(Date.now() - 86400000 * 5),
      confirmedBy: admin.id,
      addonNames: [
        "Merch Bundle",
        "PHL Airport Shuttle",
        "Lunch/Dinner Meal Add-on",
      ],
    },
    {
      bookingReference: bookingReference(8),
      fullName: "Emma Wilson",
      email: "emma.wilson@example.com",
      phone: "+1-555-0108",
      passportNumber: "OP0001111",
      passportExpiry: new Date("2028-04-22"),
      packageType: "single_game" as const,
      accommodationType: "hostel" as const,
      numberOfTravelers: 2,
      paymentAccountType: "local" as const,
      basePackagePrice: 1300,
      addonsTotalPrice: 75,
      totalAmount: 1375,
      paymentProofUrl:
        "https://res.cloudinary.com/example/sample-receipt-8.pdf",
      bookingStatus: "rejected" as const,
      rejectionReason: "Duplicate booking under same identity.",
      addonNames: ["PHL Airport Shuttle"],
    },
  ];

  for (const seed of bookingSeeds) {
    const {
      addonNames,
      confirmedAt,
      confirmedBy,
      rejectionReason,
      ...bookingData
    } = seed;
    const existing = await prisma.booking.findUnique({
      where: { bookingReference: seed.bookingReference },
      include: { bookingAddOns: true },
    });

    const data = {
      ...bookingData,
      ...(rejectionReason != null && { rejectionReason }),
      ...(confirmedAt != null && { confirmedAt }),
      ...(confirmedBy != null && { confirmedBy }),
    };

    if (existing) {
      await prisma.booking.update({
        where: { id: existing.id },
        data,
      });
      await prisma.bookingAddOn.deleteMany({
        where: { bookingId: existing.id },
      });
    } else {
      await prisma.booking.create({
        data: {
          ...data,
          bookingAddOns: {
            create: addonNames.map((name) => {
              const addon = addonList.find((a) => a.name === name);
              if (!addon) throw new Error(`Add-on not found: ${name}`);
              return {
                addonId: addon.id,
                quantity: 1,
                priceAtBooking: addon.price,
              };
            }),
          },
        },
      });
      continue;
    }

    if (addonNames.length > 0) {
      const created = await prisma.booking.findUnique({
        where: { id: existing.id },
      });
      if (created) {
        await prisma.bookingAddOn.createMany({
          data: addonNames.map((name) => {
            const addon = addonList.find((a) => a.name === name);
            if (!addon) throw new Error(`Add-on not found: ${name}`);
            return {
              bookingId: existing.id,
              addonId: addon.id,
              quantity: 1,
              priceAtBooking: addon.price,
            };
          }),
        });
      }
    }
  }

  console.log("Seeded bookings:", bookingSeeds.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
