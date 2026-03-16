import { prisma } from '../config/database.config';

export const SETTING_KEY_USD_TO_GHS = 'usd_to_ghs_rate';

/**
 * Get the admin-configured USD → GHS rate from the database.
 * Returns null if not set (caller should fall back to env or FX API).
 */
export async function getStoredUsdToGhsRate(): Promise<number | null> {
  const row = await prisma.setting.findUnique({
    where: { key: SETTING_KEY_USD_TO_GHS },
  });
  if (!row?.value) return null;
  const num = Number(row.value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

/**
 * Set the admin-configured USD → GHS rate in the database.
 * Invalidates any in-memory cache in paystack.service.
 */
export async function setStoredUsdToGhsRate(rate: number): Promise<number> {
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Rate must be a positive number');
  }
  const value = String(rate);
  await prisma.setting.upsert({
    where: { key: SETTING_KEY_USD_TO_GHS },
    create: { key: SETTING_KEY_USD_TO_GHS, value },
    update: { value },
  });
  return rate;
}
