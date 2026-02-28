import axios from '@/lib/axios';
import type { AddOn } from '@/types/booking';

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

export const getAdminAddons = async (): Promise<AddOn[]> => {
  const { data } = await axios.get<{ addons: AddOn[] }>('/admin/addons');
  return data.addons;
};

export type CreateAddonInput = {
  name: string;
  description: string;
  price: number;
  category: 'merch' | 'transport' | 'experience' | 'food';
  displayOrder?: number;
  isActive?: boolean;
};

export const createAddon = async (input: CreateAddonInput): Promise<AddOn> => {
  const { data } = await axios.post<{ addon: AddOn }>('/admin/addons', {
    ...input,
    displayOrder: input.displayOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  return data.addon;
};
