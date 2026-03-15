import { prisma } from '../config/database.config';
import { BookingFormData } from '../types/booking.types';
import { generateBookingReference } from '../utils/response.utils';

const BULK_PLACEHOLDER_URL = 'https://admin-bulk-import.placeholder';

export type CreateBookingOptions = {
  /** When set, booking is created with status confirmed and this user as confirmedBy */
  confirmedBy: string;
};

export const createBookingService = async (
  data: BookingFormData,
  options?: CreateBookingOptions
) => {
  const bookingReference = generateBookingReference();
  const extraTravelers = data.extraTravelers ?? [];
  const numberOfTravelers = 1 + extraTravelers.length;

  const booking = await prisma.booking.create({
    data: {
      bookingReference,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      passportNumber: data.passportNumber,
      passportExpiry: new Date(data.passportExpiry),
      packageType: data.packageType,
      accommodationType: data.accommodationType,
      numberOfTravelers,
      specialRequests: data.specialRequests,
      paymentAccountType: data.paymentAccountType,
      basePackagePrice: data.basePackagePrice,
      addonsTotalPrice: data.addonsTotalPrice,
      totalAmount: data.totalAmount,
      paymentProofUrl: data.paymentProofUrl,
      ...(options?.confirmedBy && {
        bookingStatus: 'confirmed',
        confirmedAt: new Date(),
        confirmedBy: options.confirmedBy,
      }),
      bookingAddOns: {
        create: data.addons.map((addon) => ({
          addonId: addon.id,
          quantity: addon.quantity || 1,
          priceAtBooking: addon.price,
        })),
      },
      bookingTravelers: {
        create: extraTravelers.map((t) => ({
          firstName: t.firstName.trim(),
          lastName: t.lastName.trim(),
          passportNumber: t.passportNumber.trim(),
          passportExpiry: new Date(t.passportExpiry),
        })),
      },
    },
    include: {
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
      bookingTravelers: true,
    },
  });

  return booking;
};

export type BulkBookingRow = Omit<BookingFormData, 'paymentProofUrl'> & {
  paymentProofUrl?: string;
};

export const createBulkBookingsService = async (params: {
  bookings: BulkBookingRow[];
  defaultPaymentProofUrl?: string;
  /** Admin user id; when set, each booking is created with status confirmed */
  confirmedBy?: string;
}) => {
  const { bookings, defaultPaymentProofUrl, confirmedBy } = params;
  const results: { index: number; bookingReference?: string; error?: string }[] = [];

  const createOptions = confirmedBy ? { confirmedBy } : undefined;

  for (let i = 0; i < bookings.length; i++) {
    const row = bookings[i];
    const paymentProofUrl =
      row.paymentProofUrl ?? defaultPaymentProofUrl ?? BULK_PLACEHOLDER_URL;
    const data: BookingFormData = { ...row, paymentProofUrl };
    try {
      const booking = await createBookingService(data, createOptions);
      results.push({ index: i + 1, bookingReference: booking.bookingReference });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      results.push({ index: i + 1, error: message });
    }
  }

  const created = results.filter((r) => r.bookingReference).length;
  const failed = results.filter((r) => r.error);
  return { created, failed, results };
};

export const confirmBookingService = async (
  bookingId: string,
  userId: string,
  flightDetails?: string
) => {
  // Verify user exists before setting confirmedBy
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error('User not found. Cannot confirm booking.');
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      bookingStatus: 'confirmed',
      confirmedAt: new Date(),
      confirmedBy: userId,
    },
    include: {
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

  return booking;
};

export const rejectBookingService = async (
  bookingId: string,
  rejectionReason: string
) => {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      bookingStatus: 'rejected',
      rejectionReason,
    },
    include: {
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

  return booking;
};
