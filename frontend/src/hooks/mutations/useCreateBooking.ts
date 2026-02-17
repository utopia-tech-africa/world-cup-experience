'use client';

import { useMutation } from '@tanstack/react-query';
import { createBooking } from '@/services/bookingService';
import { BookingFormData } from '@/types/booking';
import { useRouter } from 'next/navigation';

export const useCreateBooking = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      router.push(`/success?ref=${data.bookingReference}`);
    },
    onError: (error: any) => {
      console.error('Booking creation failed:', error);
    },
  });
};
