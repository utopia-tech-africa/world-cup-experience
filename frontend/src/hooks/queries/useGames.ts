import { useQuery } from '@tanstack/react-query';
import { getGames } from '@/services/gameService';

export const useGames = (typeCode?: string) => {
  return useQuery({
    queryKey: ['games', typeCode ?? 'all'],
    queryFn: () => getGames(typeCode),
  });
};
