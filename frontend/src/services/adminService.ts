import axios from '@/lib/axios';
import type { AddOn, AdminGame, BookingPackage, GamePackageType } from '@/types/booking';

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
  description?: string;
  price: number;
  category: 'merch' | 'transport' | 'experience' | 'food';
  displayOrder?: number;
  isActive?: boolean;
};

export const createAddon = async (input: CreateAddonInput): Promise<AddOn> => {
  const { data } = await axios.post<{ addon: AddOn }>('/admin/addons', {
    ...input,
    description: input.description ?? '',
    displayOrder: input.displayOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  return data.addon;
};

export type UpdateAddonInput = CreateAddonInput;

export const updateAddon = async (id: string, input: UpdateAddonInput): Promise<AddOn> => {
  const { data } = await axios.patch<{ addon: AddOn }>(`/admin/addons/${id}`, {
    ...input,
    description: input.description ?? '',
    displayOrder: input.displayOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  return data.addon;
};

export const getAdminPackageTypes = async (): Promise<GamePackageType[]> => {
  const { data } = await axios.get<{ types: GamePackageType[] }>('/admin/package-types');
  return data.types;
};

export type CreatePackageTypeInput = {
  name: string;
  code: string;
  displayOrder?: number;
};

export const createPackageType = async (
  input: CreatePackageTypeInput
): Promise<GamePackageType> => {
  const { data } = await axios.post<{ type: GamePackageType }>('/admin/package-types', {
    ...input,
    displayOrder: input.displayOrder ?? 0,
  });
  return data.type;
};

export type UpdatePackageTypeInput = CreatePackageTypeInput;

export const updatePackageType = async (
  id: string,
  input: UpdatePackageTypeInput
): Promise<GamePackageType> => {
  const { data } = await axios.patch<{ type: GamePackageType }>(
    `/admin/package-types/${id}`,
    { ...input, displayOrder: input.displayOrder ?? 0 }
  );
  return data.type;
};

export const deletePackageType = async (id: string): Promise<void> => {
  await axios.delete(`/admin/package-types/${id}`);
};

export const getAdminPackages = async (): Promise<BookingPackage[]> => {
  const { data } = await axios.get<{ packages: BookingPackage[] }>('/admin/packages');
  return data.packages;
};

export type CreatePackageInput = {
  name: string;
  typeId: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  hostelPrice: number;
  hotelPrice: number;
  displayOrder?: number;
  isActive?: boolean;
  gameIds?: string[];
};

export const createPackage = async (input: CreatePackageInput): Promise<BookingPackage> => {
  const { data } = await axios.post<{ package: BookingPackage }>('/admin/packages', {
    ...input,
    displayOrder: input.displayOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  return data.package;
};

export type UpdatePackageInput = CreatePackageInput;

export const updatePackage = async (id: string, input: UpdatePackageInput): Promise<BookingPackage> => {
  const { data } = await axios.patch<{ package: BookingPackage }>(`/admin/packages/${id}`, {
    ...input,
    displayOrder: input.displayOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  return data.package;
};

export const deletePackage = async (id: string): Promise<void> => {
  await axios.delete(`/admin/packages/${id}`);
};

export const getAdminGames = async (): Promise<AdminGame[]> => {
  const { data } = await axios.get<{ games: AdminGame[] }>('/admin/games');
  return data.games;
};

export type CreateGameInput = {
  typeId?: string | null;
  stadium: string;
  team1Name: string;
  team2Name: string;
  matchDate: string;
  displayOrder?: number;
};

export const createGame = async (input: CreateGameInput): Promise<AdminGame> => {
  const { data } = await axios.post<{ game: AdminGame }>('/admin/games', {
    ...input,
    displayOrder: input.displayOrder ?? 0,
  });
  return data.game;
};

export type UpdateGameInput = CreateGameInput;

export const updateGame = async (id: string, input: UpdateGameInput): Promise<AdminGame> => {
  const { data } = await axios.patch<{ game: AdminGame }>(`/admin/games/${id}`, {
    ...input,
    displayOrder: input.displayOrder ?? 0,
  });
  return data.game;
};

export const deleteGame = async (id: string): Promise<void> => {
  await axios.delete(`/admin/games/${id}`);
};
