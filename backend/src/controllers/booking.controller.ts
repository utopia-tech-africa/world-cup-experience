import { Request, Response } from 'express';
import { createBookingService } from '../services/booking.service';
import { sendSubmissionEmail } from '../services/email.service';
import { bookingSchema } from '../utils/validation.utils';
import { uploadToCloudinary } from '../services/storage.service';

export const getPackages = async (req: Request, res: Response) => {
  const packages = [
    {
      id: 'single_game',
      name: 'Single Game Package',
      date: '2026-06-27',
      game: 'Ghana vs. Croatia',
      duration: '4 nights (June 25-29)',
      pricing: {
        hotel: 1800,
        hostel: 1000,
      },
    },
    {
      id: 'double_game',
      name: 'Double Game Package',
      dates: ['2026-06-23', '2026-06-27'],
      games: ['Ghana vs. England', 'Ghana vs. Croatia'],
      duration: '7 nights (June 22-29)',
      pricing: {
        hotel: 3000,
        hostel: 1500,
      },
    },
  ];

  res.json({ packages });
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const validatedData = bookingSchema.parse(req.body);

    const booking = await createBookingService(validatedData);
    await sendSubmissionEmail(booking);

    res.status(201).json({
      success: true,
      bookingReference: booking.bookingReference,
      message: 'Booking submitted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create booking',
    });
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const url = await uploadToCloudinary(req.file);

    res.json({ url });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
};
