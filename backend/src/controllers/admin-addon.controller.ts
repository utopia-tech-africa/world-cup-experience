import { Request, Response } from 'express';
import { prisma } from '../config/database.config';
import { z } from 'zod';

const createAddonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['merch', 'transport', 'experience', 'food']),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().optional().default(true),
});

function serializeAddon(addon: { id: string; name: string; description: string; price: unknown; category: string; isActive: boolean; displayOrder: number; createdAt: Date; updatedAt: Date }) {
  return {
    ...addon,
    price: Number(addon.price),
  };
}

/** GET /api/admin/addons — list all addons (including inactive) for admin */
export const getAdminAddons = async (_req: Request, res: Response) => {
  try {
    const addons = await prisma.addOn.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
    res.json({ addons: addons.map(serializeAddon) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch add-ons';
    res.status(500).json({ error: message });
  }
};

/** POST /api/admin/addons — create addon */
export const createAddon = async (req: Request, res: Response) => {
  try {
    const parsed = createAddonSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((issue: { message: string }) => issue.message).join('; ');
      res.status(400).json({ error: msg });
      return;
    }
    const { name, description, price, category, displayOrder, isActive } = parsed.data;
    const addon = await prisma.addOn.create({
      data: {
        name,
        description,
        price,
        category,
        displayOrder,
        isActive,
      },
    });
    res.status(201).json({ addon: serializeAddon(addon) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create add-on';
    res.status(500).json({ error: message });
  }
};

/** PATCH /api/admin/addons/:id — update addon */
export const updateAddon = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Add-on ID is required' });
      return;
    }
    const parsed = createAddonSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((issue: { message: string }) => issue.message).join('; ');
      res.status(400).json({ error: msg });
      return;
    }
    const { name, description, price, category, displayOrder, isActive } = parsed.data;
    const addon = await prisma.addOn.update({
      where: { id },
      data: {
        name,
        description,
        price,
        category,
        displayOrder,
        isActive,
      },
    });
    res.json({ addon: serializeAddon(addon) });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2025') {
      res.status(404).json({ error: 'Add-on not found' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Failed to update add-on';
    res.status(500).json({ error: message });
  }
};
