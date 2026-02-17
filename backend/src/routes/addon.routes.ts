import express from 'express';
import { getAddons } from '../controllers/addon.controller';

const router = express.Router();

router.get('/addons', getAddons);

export default router;
