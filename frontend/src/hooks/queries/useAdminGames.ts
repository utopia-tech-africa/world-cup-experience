import { useQuery } from '@tanstack/react-query';
import { getAdminGames } from '@/services/adminService';

export const useAdminGames = () => {
  return useQuery({
    queryKey: ['admin', 'games'],
    queryFn: getAdminGames,
  });
};
