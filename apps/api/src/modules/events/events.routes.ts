import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
} from './events.controller';

const router = Router();

// POST /api/events – create event (auth required)
router.post('/', requireAuth, createEvent);

// GET /api/events/:id – get single event
router.get('/:id', getEventById);

// PUT /api/events/:id – update event (auth required)
router.put('/:id', requireAuth, updateEvent);

// DELETE /api/events/:id – delete event (auth required, owner only)
router.delete('/:id', requireAuth, deleteEvent);

export default router;
