import axios from '@/lib/axios';

export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await axios.post('/admin/auth/login', credentials);
  return data;
};
