import { Request, Response } from 'express';
import { prisma } from '../config/database.config';
import { confirmBookingService, rejectBookingService, createBulkBookingsService } from '../services/booking.service';
import { sendConfirmationEmail, sendRejectionEmail } from '../services/email.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { bulkBookingSchema } from '../utils/validation.utils';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [total, byStatus, revenueResult] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.groupBy({
        by: ['bookingStatus'],
        _count: { id: true },
      }),
      prisma.booking.aggregate({
        where: { bookingStatus: 'confirmed' },
        _sum: { totalAmount: true },
      }),
    ]);

    const statusCounts = Object.fromEntries(
      byStatus.map((s: { bookingStatus: string; _count: { id: number } }) => [
        s.bookingStatus,
        s._count.id,
      ])
    ) as Record<string, number>;

    res.json({
      totalBookings: total,
      pending: statusCounts.pending ?? 0,
      confirmed: statusCounts.confirmed ?? 0,
      rejected: statusCounts.rejected ?? 0,
      totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
    res.status(500).json({ error: message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status, search, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};

    if (status) {
      where.bookingStatus = status;
    }

    if (search) {
      where.OR = [
        { bookingReference: { contains: search as string, mode: 'insensitive' } },
        { fullName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          bookingAddOns: {
            include: {
              addOn: true,
            },
          },
          bookingTravelers: true,
        },
        orderBy: { submittedAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch bookings';
    res.status(500).json({ error: message });
  }
};

const getIdParam = (params: Request['params'], key: string): string => {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req.params, 'id');
    if (!id) return res.status(400).json({ error: 'Booking ID is required' });

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingAddOns: {
          include: {
            addOn: true,
          },
        },
        bookingTravelers: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch booking';
    res.status(500).json({ error: message });
  }
};

export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const id = getIdParam(req.params, 'id');
    if (!id) return res.status(400).json({ error: 'Booking ID is required' });
    const { flightDetails } = req.body;
    const userId = req.user!.userId;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingAddOns: { include: { addOn: true } },
      },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.bookingStatus !== 'pending') {
      return res.status(400).json({ error: 'Booking is not pending' });
    }

    await sendConfirmationEmail(booking);
    await confirmBookingService(id, userId, flightDetails);

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to confirm booking';
    res.status(500).json({ error: message });
  }
};

export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req.params, 'id');
    if (!id) return res.status(400).json({ error: 'Booking ID is required' });
    const { rejectionReason } = req.body;

    if (!rejectionReason || typeof rejectionReason !== 'string') {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingAddOns: { include: { addOn: true } },
      },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.bookingStatus !== 'pending') {
      return res.status(400).json({ error: 'Booking is not pending' });
    }

    await sendRejectionEmail(booking, rejectionReason.trim());
    await rejectBookingService(id, rejectionReason.trim());

    res.json({
      success: true,
      message: 'Booking rejected successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reject booking';
    res.status(500).json({ error: message });
  }
};

export const createBulkBookings = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = bulkBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.message ?? 'Invalid bulk booking payload',
      });
    }
    const { bookings, defaultPaymentProofUrl } = parsed.data;
    const confirmedBy = req.user?.userId;
    const result = await createBulkBookingsService({
      bookings,
      defaultPaymentProofUrl,
      confirmedBy: confirmedBy ?? undefined,
    });
    res.status(201).json({
      success: true,
      created: result.created,
      failed: result.failed.length,
      results: result.results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bulk booking failed';
    res.status(500).json({ success: false, error: message });
  }
};
