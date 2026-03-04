import { useQuery } from '@tanstack/react-query';
import { getAdminPackageTypes } from '@/services/adminService';

export const useAdminPackageTypes = () => {
  return useQuery({
    queryKey: ['admin', 'package-types'],
    queryFn: getAdminPackageTypes,
  });
};
