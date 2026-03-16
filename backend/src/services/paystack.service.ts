import { z } from 'zod';

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
  // Default to Ghanaian Cedi for this project
  currency: z.string().default('GHS'),
  bookingReference: z.string().optional(),
});

export type InitPaystackTransactionInput = z.infer<typeof initTransactionSchema>;

export type InitPaystackTransactionResult = {
  authorizationUrl: string;
  reference: string;
};

export const initPaystackTransaction = async (
  input: InitPaystackTransactionInput
): Promise<InitPaystackTransactionResult> => {
  const parsed = initTransactionSchema.parse(input);

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack is not configured on the server');
  }

  const koboAmount = Math.round(parsed.amount * 100);

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
        currency: parsed.currency,
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

