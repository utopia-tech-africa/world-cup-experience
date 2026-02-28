import express from 'express';
import { getDashboardStats, getBookings, getBookingById, confirmBooking, rejectBooking } from '../controllers/admin.controller';
import { getAdminAddons, createAddon } from '../controllers/admin-addon.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', getDashboardStats);
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById);
router.patch('/bookings/:id/confirm', confirmBooking);
router.patch('/bookings/:id/reject', rejectBooking);

router.get('/addons', getAdminAddons);
router.post('/addons', createAddon);

export default router;
