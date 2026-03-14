import { useQuery } from '@tanstack/react-query';
import { getAdminTeams } from '@/services/adminService';

export const useAdminTeams = () => {
  return useQuery({
    queryKey: ['admin', 'teams'],
    queryFn: getAdminTeams,
  });
};
