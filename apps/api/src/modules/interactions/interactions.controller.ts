// interactions.controller.ts
// HTTP layer only. Reads auth + params, calls service, returns response.

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/requireAuth';
import { toggleLike, markAttendance } from './interactions.service';
import { successResponse, errorResponse } from '../../utils';
import type { AttendStatus } from './interactions.types';

const VALID_STATUSES: AttendStatus[] = ['going', 'interested'];

// POST /api/events/:id/like
export async function likeEventHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await toggleLike(req.auth!.userId, req.params.id);
        res.status(200).json(successResponse(result));
    } catch (err) {
        next(err);
    }
}

// POST /api/events/:id/attend
export async function attendEventHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { status } = req.body as { status?: unknown };

        if (!status || !VALID_STATUSES.includes(status as AttendStatus)) {
            res.status(400).json(errorResponse(`status must be one of: ${VALID_STATUSES.join(', ')}`));
            return;
        }

        const result = await markAttendance(req.auth!.userId, req.params.id, status as AttendStatus);
        res.status(200).json(successResponse(result));
    } catch (err) {
        next(err);
    }
}
