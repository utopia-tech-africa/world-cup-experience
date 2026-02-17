import { useQuery } from '@tanstack/react-query';
import { getBookings } from '@/services/adminService';

interface UseBookingsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useBookings = (params: UseBookingsParams) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => getBookings(params),
  });
};
