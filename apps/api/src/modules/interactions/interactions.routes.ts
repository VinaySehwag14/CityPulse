import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { likeEventHandler, attendEventHandler } from './interactions.controller';

const router = Router({ mergeParams: true }); // access :id from parent

// POST /api/events/:id/like – toggle like (auth required)
router.post('/like', requireAuth, likeEventHandler);

// POST /api/events/:id/attend – mark as going/interested (auth required)
router.post('/attend', requireAuth, attendEventHandler);

export default router;
