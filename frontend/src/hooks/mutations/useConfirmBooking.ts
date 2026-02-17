'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmBooking } from '@/services/adminService';
import type { Booking } from '@/types/booking';

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, flightDetails }: { id: string; flightDetails?: string }) =>
      confirmBooking(id, flightDetails),
    onSuccess: (_, variables) => {
      const now = new Date().toISOString();
      queryClient.setQueryData<Booking>(['booking', variables.id], (old) => {
        if (!old) return old;
        return { ...old, bookingStatus: 'confirmed', confirmedAt: now };
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      void queryClient.refetchQueries({ queryKey: ['booking', variables.id] });
    },
  });
};
