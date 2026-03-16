import { z } from 'zod';
import { getStoredUsdToGhsRate } from './settings.service';

export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
export const PAYSTACK_API_BASE_URL =
  process.env.PAYSTACK_API_BASE_URL ?? 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
  // We don't throw here to avoid crashing the app in environments
  // where Paystack hasn't been configured yet. The service will
  // validate presence before making any requests.
  // eslint-disable-next-line no-console
  console.warn(
    '[paystack] PAYSTACK_SECRET_KEY is not set. Local Paystack payments will not work.'
  );
}

const initTransactionSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  // Currency of the amount provided by the client (USD or GHS)
  currency: z.enum(['USD', 'GHS']).default('USD'),
  bookingReference: z.string().optional(),
});

export type InitPaystackTransactionInput = z.infer<typeof initTransactionSchema>;

export type InitPaystackTransactionResult = {
  authorizationUrl: string;
  reference: string;
};

const DEFAULT_USD_TO_GHS_RATE = 11;

let cachedUsdToGhsRate: number | null = null;
let cachedRateFetchedAt: number | null = null;

/** Call this when admin updates the rate so the next payment uses the new value. */
export function invalidateUsdToGhsCache(): void {
  cachedUsdToGhsRate = null;
  cachedRateFetchedAt = null;
}

async function getUsdToGhsRate(): Promise<number> {
  // 1) Admin-configured rate (database) — highest priority
  const storedRate = await getStoredUsdToGhsRate();
  if (storedRate != null) return storedRate;

  // 2) Env override for local/dev or when FX API is unavailable
  const staticRate = process.env.FX_STATIC_USD_TO_GHS
    ? Number(process.env.FX_STATIC_USD_TO_GHS)
    : null;
  if (staticRate && Number.isFinite(staticRate) && staticRate > 0) {
    return staticRate;
  }

  const FX_API_URL =
    process.env.FX_API_URL ??
    'https://api.exchangerate.host/latest?base=USD&symbols=GHS';

  const now = Date.now();
  if (cachedUsdToGhsRate != null && cachedRateFetchedAt != null && now - cachedRateFetchedAt < 60 * 60 * 1000) {
    return cachedUsdToGhsRate;
  }

  try {
    const res = await fetch(FX_API_URL);
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `[fx] Failed to fetch FX rate (status ${res.status}), falling back to ${DEFAULT_USD_TO_GHS_RATE}`
      );
      return DEFAULT_USD_TO_GHS_RATE;
    }
    const data = (await res.json()) as { rates?: { GHS?: number } };
    const rate = data.rates?.GHS;
    if (!rate || !Number.isFinite(rate)) {
      // eslint-disable-next-line no-console
      console.warn(
        `[fx] Invalid FX rate response for USD→GHS, falling back to ${DEFAULT_USD_TO_GHS_RATE}`
      );
      return DEFAULT_USD_TO_GHS_RATE;
    }
    cachedUsdToGhsRate = rate;
    cachedRateFetchedAt = now;
    return rate;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `[fx] Error fetching FX rate, falling back to ${DEFAULT_USD_TO_GHS_RATE}`,
      error
    );
    return DEFAULT_USD_TO_GHS_RATE;
  }
}

export const initPaystackTransaction = async (
  input: InitPaystackTransactionInput
): Promise<InitPaystackTransactionResult> => {
  const parsed = initTransactionSchema.parse(input);

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack is not configured on the server');
  }

  // Convert from USD to GHS if needed before sending to Paystack
  let amountInGhs = parsed.amount;
  if (parsed.currency === 'USD') {
    const rate = await getUsdToGhsRate();
    amountInGhs = parsed.amount * rate;
  }

  const koboAmount = Math.round(amountInGhs * 100);

  const response = await fetch(
    `${PAYSTACK_API_BASE_URL}/transaction/initialize`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: parsed.email,
        amount: koboAmount,
        currency: 'GHS',
        callback_url: `${process.env.CLIENT_URL ?? 'http://localhost:3000'}/booking/paystack-callback`,
        metadata: {
          bookingReference: parsed.bookingReference,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to initialize Paystack transaction (status ${response.status})`
    );
  }

  const data = (await response.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  };

  if (!data.status || !data.data?.authorization_url || !data.data.reference) {
    throw new Error(
      data.message || 'Invalid response from Paystack initialize endpoint'
    );
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  };
};

