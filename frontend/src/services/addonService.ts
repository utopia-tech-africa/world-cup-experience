import axios from '@/lib/axios';
import type { AddOn } from '@/types/booking';

export const getAddons = async (): Promise<AddOn[]> => {
  const { data } = await axios.get<{ addons: AddOn[] }>('/addons');
  return data.addons;
};
