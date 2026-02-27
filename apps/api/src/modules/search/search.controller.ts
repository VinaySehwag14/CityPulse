// search.controller.ts
// HTTP layer only. Validates query, calls service, returns response.

import type { Request, Response, NextFunction } from 'express';
import { validateSearchQuery, parseSearchQuery } from './search.validation';
import { searchEvents } from './search.service';
import { successResponse, errorResponse } from '../../utils';

// GET /api/search?q=...&lat=...&lng=...&radius_km=...
export async function searchHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const raw = req.query as Record<string, unknown>;
        const validationError = validateSearchQuery(raw);

        if (validationError) {
            res.status(400).json(errorResponse(validationError));
            return;
        }

        const query = parseSearchQuery(raw);
        const results = await searchEvents(query);

        res.status(200).json(successResponse(results));
    } catch (err) {
        next(err);
    }
}
