import { z } from 'zod';

export const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  passportNumber: z.string().min(5, 'Passport number is required'),
  passportExpiry: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Passport expiry must be a future date'
  ),
  packageType: z.string().min(1, 'Package type is required'),
  accommodationType: z.enum(['hotel', 'hostel']),
  numberOfTravelers: z.number().int().min(1).max(10),
  specialRequests: z.string().optional(),
  paymentAccountType: z.enum(['local', 'international']),
  basePackagePrice: z.number().positive(),
  addonsTotalPrice: z.number().min(0),
  totalAmount: z.number().positive(),
  paymentProofUrl: z.string().url('Invalid payment proof URL'),
  addons: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().min(1).optional(),
      price: z.number().positive(),
    })
  ),
});
