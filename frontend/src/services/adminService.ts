import axios from '@/lib/axios';

export type DashboardStats = {
  totalBookings: number;
  pending: number;
  confirmed: number;
  rejected: number;
  totalRevenue: number;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await axios.get<DashboardStats>('/admin/stats');
  return data;
};

interface GetBookingsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getBookings = async (params: GetBookingsParams) => {
  const { data } = await axios.get('/admin/bookings', { params });
  return data;
};

export const getBookingById = async (id: string) => {
  const { data } = await axios.get(`/admin/bookings/${id}`);
  return data.booking;
};

export const confirmBooking = async (id: string, flightDetails?: string) => {
  const { data } = await axios.patch(`/admin/bookings/${id}/confirm`, {
    flightDetails,
  });
  return data;
};

export const rejectBooking = async (id: string, rejectionReason: string) => {
  const { data } = await axios.patch(`/admin/bookings/${id}/reject`, {
    rejectionReason,
  });
  return data;
};
