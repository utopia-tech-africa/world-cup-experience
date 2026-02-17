import { prisma } from '../config/database.config';
import { BookingFormData } from '../types/booking.types';
import { generateBookingReference } from '../utils/response.utils';

export const createBookingService = async (data: BookingFormData) => {
  const bookingReference = generateBookingReference();

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
      numberOfTravelers: data.numberOfTravelers,
      specialRequests: data.specialRequests,
      paymentAccountType: data.paymentAccountType,
      basePackagePrice: data.basePackagePrice,
      addonsTotalPrice: data.addonsTotalPrice,
      totalAmount: data.totalAmount,
      paymentProofUrl: data.paymentProofUrl,
      bookingAddOns: {
        create: data.addons.map((addon) => ({
          addonId: addon.id,
          quantity: addon.quantity || 1,
          priceAtBooking: addon.price,
        })),
      },
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

export const confirmBookingService = async (
  bookingId: string,
  userId: string,
  flightDetails?: string
) => {
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
