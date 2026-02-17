import { useQuery } from '@tanstack/react-query';
import { getAddons } from '@/services/addonService';

export const useAddons = () => {
  return useQuery({
    queryKey: ['addons'],
    queryFn: getAddons,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
