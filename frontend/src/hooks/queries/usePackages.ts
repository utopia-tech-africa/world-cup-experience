import { useQuery } from '@tanstack/react-query';
import { getPackages } from '@/services/packageService';

export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: getPackages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
