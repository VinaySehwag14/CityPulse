import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import eventsRoutes from './modules/events/events.routes';

// Phase 2+ routes are NOT registered yet.
// Add them here when their phase begins.

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/events', eventsRoutes);

// Health-check
router.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
});

export default router;
