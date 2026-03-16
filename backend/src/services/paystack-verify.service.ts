import { prisma } from '../config/database.config';
import { PAYSTACK_SECRET_KEY, PAYSTACK_API_BASE_URL } from './paystack.service';

type PaystackVerifyResponse = {
  status: boolean;
  message?: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    currency?: string;
    metadata?: {
      bookingReference?: string;
    };
  };
};

export const verifyPaystackTransaction = async (reference: string) => {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack is not configured on the server');
  }

  const response = await fetch(
    `${PAYSTACK_API_BASE_URL}/transaction/verify/${encodeURIComponent(
      reference
    )}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to verify Paystack transaction (status ${response.status})`
    );
  }

  const data = (await response.json()) as PaystackVerifyResponse;

  if (!data.status || !data.data || data.data.status !== 'success') {
    throw new Error(data.message || 'Paystack did not mark transaction success');
  }

  const bookingReference = data.data.metadata?.bookingReference;
  if (!bookingReference) {
    throw new Error('Missing booking reference in Paystack metadata');
  }

  const booking = await prisma.booking.findUnique({
    where: { bookingReference },
  });

  if (!booking) {
    throw new Error('Booking not found for this transaction');
  }

  if (booking.bookingStatus === 'confirmed') {
    return booking;
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      bookingStatus: 'confirmed',
      confirmedAt: new Date(),
      // Store the Paystack reference so support can reconcile issues later
      paymentProofUrl:
        data.data.reference != null
          ? `paystack://reference/${data.data.reference}`
          : booking.paymentProofUrl,
    },
  });

  return updated;
};

