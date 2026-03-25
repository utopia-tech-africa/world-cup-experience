export type AccommodationType = 'hotel' | 'hostel';
export type PaymentAccountType = 'local' | 'international';
export type BookingStatus = 'pending' | 'confirmed' | 'rejected';

/** Game/package type (admin-managed); used when creating packages */
export interface GamePackageType {
  id: string;
  name: string;
  code: string;
  displayOrder: number;
}

/** Team (admin-managed); create teams with flags, then select them when creating games */
export interface Team {
  id: string;
  name: string;
  flagUrl?: string | null;
  displayOrder: number;
}

/** Match/fixture (admin-managed); team1 and team2 are selected from Teams */
export interface AdminGame {
  id: string;
  typeId?: string | null;
  type?: { id: string; name: string; code: string } | null;
  stadium: string;
  team1Id: string;
  team2Id: string;
  team1: Team;
  team2: Team;
  matchDate: string;
  displayOrder: number;
}

/** Game from public API (for landing game cards) */
export interface PublicGame {
  id: string;
  typeCode: string;
  stadium: string;
  team1: { id: string; name: string; flagUrl?: string | null };
  team2: { id: string; name: string; flagUrl?: string | null };
  matchDate: string;
  displayOrder: number;
}

/** Package from API; type is code (string) for pricing; admin API also returns typeId and type object */
export interface BookingPackage {
  id: string;
  name: string;
  /** Type code (e.g. single_game) or full type object from admin API */
  type: string | GamePackageType;
  typeName?: string;
  typeId?: string;
  duration: string;
  /** When set, frontend can show nights and date range */
  startDate?: string;
  endDate?: string;
  nights?: number;
  hostelPrice: number;
  hotelPrice: number;
  threeStarHotelPrice?: number;
  fourStarHotelPrice?: number;
  cityCount?: number;
  includedItems?: string[];
  displayOrder: number;
  isActive: boolean;
  /** Games nested when fetching packages (public GET /api/packages) */
  games?: PublicGame[];
  /** Game IDs linked to this package (admin API only; used when creating/editing) */
  gameIds?: string[];
  comparisonOptions?: PackageComparisonOption[];
}

export type PackageComparisonTier = 'three_star' | 'four_star';

export interface PackageComparisonFeature {
  id?: string;
  lineKey: string;
  title: string;
  description?: string;
  iconKey?: string;
  displayOrder?: number;
}

export interface PackageComparisonOption {
  id?: string;
  tier: PackageComparisonTier;
  label: string;
  price: number;
  roomLabel?: string;
  imageUrl?: string;
  ctaLabel?: string;
  displayOrder?: number;
  features: PackageComparisonFeature[];
}

export type PackageComparisonRowSideValue = {
  title: string;
  description?: string;
  iconKey?: string;
};

export interface PackageComparisonRow {
  lineKey: string;
  displayOrder: number;
  left?: PackageComparisonRowSideValue;
  right?: PackageComparisonRowSideValue;
}

export type ComparePackageOptionsQuery = {
  leftOptionId?: string;
  rightOptionId?: string;
  leftPackageId?: string;
  rightPackageId?: string;
  leftTier?: PackageComparisonTier;
  rightTier?: PackageComparisonTier;
};

export interface ComparedPackageGame {
  id: string;
  typeCode: string;
  stadium: string;
  team1: { id: string; name: string; flagUrl?: string };
  team2: { id: string; name: string; flagUrl?: string };
  matchDate: string;
  displayOrder: number;
}

export interface ComparedPackageComparisonOption {
  id: string;
  packageId: string;
  packageName: string;
  packageTypeName: string;
  packageTypeCode: string;
  tier: PackageComparisonTier;
  label: string;
  price: number;
  roomLabel?: string;
  imageUrl?: string;
  ctaLabel?: string;
  duration: string;
  nights?: number;
  cityCount: number;
  includedItems: string[];
  games: ComparedPackageGame[];
}

export type PackageComparisonResponse = {
  left: ComparedPackageComparisonOption;
  right: ComparedPackageComparisonOption;
  comparisonRows: PackageComparisonRow[];
};

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

/** Extra traveler in form/store (uses passportExpiryDate for the input field). */
export interface ExtraTraveler {
  firstName: string;
  lastName: string;
  passportNumber: string;
  passportExpiryDate: string;
}

/** Extra traveler as sent to the API (passportExpiry is YYYY-MM-DD). */
export interface ExtraTravelerPayload {
  firstName: string;
  lastName: string;
  passportNumber: string;
  passportExpiry: string;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  packageType: string;
  accommodationType: AccommodationType;
  numberOfTravelers: number;
  extraTravelers?: ExtraTravelerPayload[];
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

export interface BookingTraveler {
  id: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  passportExpiry: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  packageType: string;
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
  bookingTravelers?: BookingTraveler[];
}
