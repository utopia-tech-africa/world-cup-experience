import express from 'express';
import bookingRoutes from './booking.routes';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import addonRoutes from './addon.routes';
import packageRoutes from './package.routes';
import gameRoutes from './game.routes';

const router = express.Router();

router.use('/', bookingRoutes);
router.use('/admin/auth', authRoutes); // Must be before /admin so login is reachable
router.use('/admin', adminRoutes);
router.use('/', addonRoutes);
router.use('/', packageRoutes);
router.use('/', gameRoutes);

export default router;
