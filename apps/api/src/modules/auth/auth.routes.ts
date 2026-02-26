import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { syncUser } from './auth.controller';

const router = Router();

// POST /api/auth/sync – sync authenticated Clerk user to DB
router.post('/sync', requireAuth, syncUser);

export default router;
