import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import {
    createEventHandler,
    getEventByIdHandler,
    updateEventHandler,
    deleteEventHandler,
} from './events.controller';

const router = Router();

// POST /api/events – create event (auth required)
router.post('/', requireAuth, createEventHandler);

// GET /api/events/:id – get single event (public)
router.get('/:id', getEventByIdHandler);

// PUT /api/events/:id – update event (auth required, owner only)
router.put('/:id', requireAuth, updateEventHandler);

// DELETE /api/events/:id – delete event (auth required, owner only)
router.delete('/:id', requireAuth, deleteEventHandler);

export default router;
