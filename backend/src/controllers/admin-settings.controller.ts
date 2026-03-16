import { Request, Response } from 'express';
import { z } from 'zod';
import {
  getStoredUsdToGhsRate,
  setStoredUsdToGhsRate,
} from '../services/settings.service';
import { invalidateUsdToGhsCache } from '../services/paystack.service';

const updateFxRateSchema = z.object({
  usdToGhsRate: z.number().positive('Rate must be a positive number'),
});

/** GET /api/admin/settings/fx-rate — get current USD→GHS rate (admin-configured or null) */
export const getFxRate = async (_req: Request, res: Response) => {
  try {
    const rate = await getStoredUsdToGhsRate();
    res.json({ usdToGhsRate: rate });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch FX rate';
    res.status(500).json({ error: message });
  }
};

/** PATCH /api/admin/settings/fx-rate — set USD→GHS rate (admin override) */
export const updateFxRate = async (req: Request, res: Response) => {
  try {
    const parsed = updateFxRateSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((issue: { message: string }) => issue.message)
        .join('; ');
      res.status(400).json({ error: msg });
      return;
    }
    const rate = await setStoredUsdToGhsRate(parsed.data.usdToGhsRate);
    invalidateUsdToGhsCache();
    res.json({ usdToGhsRate: rate });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to update FX rate';
    res.status(500).json({ error: message });
  }
};
