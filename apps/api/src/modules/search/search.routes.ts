import { Router } from 'express';
import { searchHandler } from './search.controller';

const router = Router();

// GET /api/search – text + geo radius search (public)
router.get('/', searchHandler);

export default router;
