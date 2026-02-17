import { Request, Response } from 'express';
import { prisma } from '../config/database.config';

export const getAddons = async (req: Request, res: Response) => {
  try {
    const addons = await prisma.addOn.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    res.json({ addons });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch add-ons' });
  }
};
