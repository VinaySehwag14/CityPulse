import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import eventsRoutes from './modules/events/events.routes';
import feedRoutes from './modules/feed/feed.routes';
import searchRoutes from './modules/search/search.routes';

const router = Router();

// ── Phase 1 ─────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/events', eventsRoutes);

// ── Phase 2 ─────────────────────────────────────────────────────
router.use('/feed', feedRoutes);
router.use('/search', searchRoutes);

// Health-check
router.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
});

export default router;
