import axios from '@/lib/axios';
import type { BookingPackage } from '@/types/booking';

export const getPackages = async (): Promise<BookingPackage[]> => {
  const { data } = await axios.get<{ packages: BookingPackage[] }>('/packages');
  return data.packages;
};
