import { z } from 'zod';
import { bookingSchema } from '../utils/validation.utils';

export type BookingFormData = z.infer<typeof bookingSchema>;
