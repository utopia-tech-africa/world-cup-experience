import { useQuery } from '@tanstack/react-query';
import { getFxRate } from '@/services/adminService';

export const useFxRate = () => {
  return useQuery({
    queryKey: ['admin', 'settings', 'fx-rate'],
    queryFn: () => getFxRate().then((r) => r.usdToGhsRate),
  });
};
