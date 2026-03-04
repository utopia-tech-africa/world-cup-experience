import express from 'express';
import { getDashboardStats, getBookings, getBookingById, confirmBooking, rejectBooking } from '../controllers/admin.controller';
import { getAdminAddons, createAddon, updateAddon } from '../controllers/admin-addon.controller';
import { getAdminPackages, createPackage, updatePackage, deletePackage } from '../controllers/admin-package.controller';
import {
  getAdminPackageTypes,
  createPackageType,
  updatePackageType,
  deletePackageType,
} from '../controllers/admin-package-type.controller';
import { getAdminGames, createGame, updateGame, deleteGame } from '../controllers/admin-game.controller';
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
router.patch('/addons/:id', updateAddon);

router.get('/package-types', getAdminPackageTypes);
router.post('/package-types', createPackageType);
router.patch('/package-types/:id', updatePackageType);
router.delete('/package-types/:id', deletePackageType);

router.get('/packages', getAdminPackages);
router.post('/packages', createPackage);
router.patch('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

router.get('/games', getAdminGames);
router.post('/games', createGame);
router.patch('/games/:id', updateGame);
router.delete('/games/:id', deleteGame);

export default router;
