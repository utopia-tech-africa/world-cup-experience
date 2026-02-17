'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectBooking } from '@/services/adminService';
import type { Booking } from '@/types/booking';

export const useRejectBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      rejectBooking(id, rejectionReason),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Booking>(['booking', variables.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          bookingStatus: 'rejected',
          rejectionReason: variables.rejectionReason,
        };
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      void queryClient.refetchQueries({ queryKey: ['booking', variables.id] });
    },
  });
};
