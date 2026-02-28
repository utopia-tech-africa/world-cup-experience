import { Router } from 'express';
import { prisma } from '../config/database.config';

const router = Router();

/** GET /api/health — liveness: server is up */
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/** GET /api/health/ready — readiness: server + DB reachable */
router.get('/health/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

export default router;
