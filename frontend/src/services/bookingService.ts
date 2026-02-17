import axios from '@/lib/axios';
import { BookingFormData } from '@/types/booking';

export const createBooking = async (data: BookingFormData) => {
  const { data: response } = await axios.post('/bookings', data);
  return response;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.url;
};
