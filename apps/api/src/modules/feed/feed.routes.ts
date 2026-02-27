import { Router } from 'express';
import { getFeedHandler } from './feed.controller';

const router = Router();

// GET /api/feed – ranked, paginated, fresh events (public)
router.get('/', getFeedHandler);

export default router;
