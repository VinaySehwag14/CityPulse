import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { addCommentHandler, getCommentsHandler } from './comments.controller';

const router = Router({ mergeParams: true });

// GET /api/events/:id/comments – list comments (public)
router.get('/', getCommentsHandler);

// POST /api/events/:id/comments – add comment (auth required)
router.post('/', requireAuth, addCommentHandler);

export default router;
