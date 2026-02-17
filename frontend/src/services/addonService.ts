import axios from '@/lib/axios';

export const getAddons = async () => {
  const { data } = await axios.get('/addons');
  return data.addons;
};
