'use client';

import { useMutation } from '@tanstack/react-query';
import { createBooking } from '@/services/bookingService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export const useCreateBooking = () => {
  const router = useRouter();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      addToast(
        `Booking ${data.bookingReference} submitted successfully.`,
        'success',
        5000
      );
      router.push(`/success?ref=${data.bookingReference}`);
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : null;
      addToast(
        message || 'Failed to submit booking. Please try again.',
        'error',
        5000
      );
    },
  });
};
