import { Request, Response } from 'express';
import {
  initPaystackTransaction,
  InitPaystackTransactionInput,
} from '../services/paystack.service';
import { verifyPaystackTransaction } from '../services/paystack-verify.service';

export const initPaystack = async (req: Request, res: Response) => {
  try {
    const { email, amount, currency, bookingReference } = req.body as Partial<
      InitPaystackTransactionInput
    >;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email is required' });
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const result = await initPaystackTransaction({
      email,
      amount,
      currency: currency ?? 'GHS',
      bookingReference,
    });

    res.json({
      authorizationUrl: result.authorizationUrl,
      reference: result.reference,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to initialize Paystack';
    res.status(500).json({ error: message });
  }
};

export const verifyPaystack = async (req: Request, res: Response) => {
  try {
    const { reference } = req.body as { reference?: string };
    if (!reference) {
      return res.status(400).json({ error: 'reference is required' });
    }

    const booking = await verifyPaystackTransaction(reference);

    res.json({
      success: true,
      bookingReference: booking.bookingReference,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to verify Paystack payment';
    res.status(500).json({ success: false, error: message });
  }
};


