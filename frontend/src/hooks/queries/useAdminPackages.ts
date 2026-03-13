import { useQuery } from '@tanstack/react-query';
import { getAdminPackages } from '@/services/adminService';

export const useAdminPackages = () => {
  return useQuery({
    queryKey: ['admin', 'packages'],
    queryFn: getAdminPackages,
  });
};
