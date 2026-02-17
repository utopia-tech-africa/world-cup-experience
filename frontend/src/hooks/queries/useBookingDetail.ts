import { useQuery } from '@tanstack/react-query';
import { getBookingById } from '@/services/adminService';

export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
};
