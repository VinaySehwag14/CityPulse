// feed.controller.ts
// HTTP layer only. Parses query params, calls feed.service, returns response.
// No database access. No business logic. Per AI_RULES.md §1.

import type { Request, Response, NextFunction } from 'express';
import { getFeed } from './feed.service';
import { successResponse } from '../../utils';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// GET /api/feed?page=1&limit=20
export async function getFeedHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = Math.max(1, parseInt(String(req.query.page ?? DEFAULT_PAGE), 10) || DEFAULT_PAGE);
        const limit = Math.min(
            MAX_LIMIT,
            Math.max(1, parseInt(String(req.query.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
        );

        const result = await getFeed({ page, limit });
        res.status(200).json(successResponse(result));
    } catch (err) {
        next(err);
    }
}
