import axios from '@/lib/axios';
import type { PublicGame } from '@/types/booking';

export const getGames = async (typeCode?: string): Promise<PublicGame[]> => {
  const { data } = await axios.get<{ games: PublicGame[] }>('/games', {
    params: typeCode ? { typeCode } : undefined,
  });
  return data.games;
};
