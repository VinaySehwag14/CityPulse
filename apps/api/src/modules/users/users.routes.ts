import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { getUserById } from './users.controller';

const router = Router();

// GET /api/users/:id
router.get('/:id', requireAuth, getUserById);

export default router;
