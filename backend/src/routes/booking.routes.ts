import express from 'express';
import { createBooking, uploadFile } from '../controllers/booking.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.post('/bookings', createBooking);
router.post('/upload', upload.single('file'), uploadFile);

export default router;
