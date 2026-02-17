import axios from '@/lib/axios';

export const getPackages = async () => {
  const { data } = await axios.get('/packages');
  return data.packages;
};
