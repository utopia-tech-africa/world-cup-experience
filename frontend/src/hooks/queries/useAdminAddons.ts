import { useQuery } from '@tanstack/react-query';
import { getAdminAddons } from '@/services/adminService';

export const useAdminAddons = () => {
  return useQuery({
    queryKey: ['admin', 'addons'],
    queryFn: getAdminAddons,
  });
};
