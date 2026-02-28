import { Request, Response } from 'express';
import { prisma } from '../config/database.config';

function serializeAddon(addon: { id: string; name: string; description: string; price: unknown; category: string; isActive: boolean; displayOrder: number; createdAt: Date; updatedAt: Date }) {
  return {
    ...addon,
    price: Number(addon.price),
  };
}

export const getAddons = async (req: Request, res: Response) => {
  try {
    const addons = await prisma.addOn.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ addons: addons.map(serializeAddon) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch add-ons';
    res.status(500).json({ error: message });
  }
};
