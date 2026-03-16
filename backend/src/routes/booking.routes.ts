import express from 'express';
import { createBooking, uploadFile } from '../controllers/booking.controller';
import { initPaystack, verifyPaystack } from '../controllers/payment.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.post('/bookings', createBooking);
router.post('/upload', upload.single('file'), uploadFile);
router.post('/payments/paystack/init', initPaystack);
router.post('/payments/paystack/verify', verifyPaystack);

export default router;
