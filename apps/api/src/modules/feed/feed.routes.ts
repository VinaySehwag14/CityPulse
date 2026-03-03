import { Router } from 'express';
import { getFeedHandler } from './feed.controller';
import { optionalAuth } from '../../middleware/optionalAuth';

const router = Router();

// GET /api/feed – ranked, paginated, fresh events (public, but personalized if auth token provided)
router.get('/', optionalAuth, getFeedHandler);

export default router;
