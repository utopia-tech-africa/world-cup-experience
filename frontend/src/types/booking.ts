export type PackageType = 'single_game' | 'double_game';
export type AccommodationType = 'hotel' | 'hostel';
export type PaymentAccountType = 'local' | 'international';
export type BookingStatus = 'pending' | 'confirmed' | 'rejected';

export interface Package {
  id: string;
  name: string;
  date?: string;
  dates?: string[];
  game?: string;
  games?: string[];
  duration: string;
  pricing: {
    hotel: number;
    hostel: number;
  };
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'merch' | 'transport' | 'experience' | 'food';
  isActive: boolean;
  displayOrder: number;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  packageType: PackageType;
  accommodationType: AccommodationType;
  numberOfTravelers: number;
  specialRequests?: string;
  paymentAccountType: PaymentAccountType;
  basePackagePrice: number;
  addonsTotalPrice: number;
  totalAmount: number;
  paymentProofUrl: string;
  addons: Array<{
    id: string;
    quantity?: number;
    price: number;
  }>;
}

export interface Booking {
  id: string;
  bookingReference: string;
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  packageType: PackageType;
  accommodationType: AccommodationType;
  numberOfTravelers: number;
  specialRequests?: string;
  paymentAccountType: PaymentAccountType;
  basePackagePrice: number;
  addonsTotalPrice: number;
  totalAmount: number;
  paymentProofUrl: string;
  bookingStatus: BookingStatus;
  rejectionReason?: string;
  submittedAt: string;
  confirmedAt?: string;
  bookingAddOns: Array<{
    id: string;
    quantity: number;
    priceAtBooking: number;
    addOn: AddOn;
  }>;
}
