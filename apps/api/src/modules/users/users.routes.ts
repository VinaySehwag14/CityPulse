import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import {
    getUserByIdHandler,
    followUserHandler,
    getFollowersHandler,
    getFollowingHandler,
} from './users.controller';

const router = Router();

// GET /api/users/:id
router.get('/:id', getUserByIdHandler);

// POST /api/users/:id/follow – toggle follow (auth required)
router.post('/:id/follow', requireAuth, followUserHandler);

// GET /api/users/:id/followers (public)
router.get('/:id/followers', getFollowersHandler);

// GET /api/users/:id/following (public)
router.get('/:id/following', getFollowingHandler);

export default router;
