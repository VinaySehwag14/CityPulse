// events.controller.ts
// HTTP layer only – parse request, validate, call service, return response.
// No database access. No business logic. Per AI_RULES.md §1 & ARCHITECTURE.md.

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/requireAuth';
import { validateCreateEvent, validateUpdateEvent } from './events.validation';
import {
    createEvent,
    getEventDetail,
    updateEvent,
    deleteEvent,
} from './events.service';
import { successResponse, errorResponse } from '../../utils';

// POST /api/events
export async function createEventHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const validationError = validateCreateEvent(req.body);
        if (validationError) {
            res.status(400).json(errorResponse(validationError));
            return;
        }

        const event = await createEvent(req.auth!.userId, req.body);
        res.status(201).json(successResponse(event));
    } catch (err) {
        next(err);
    }
}

// GET /api/events/:id – returns full detail (like_count, attendees, comments)
export async function getEventByIdHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const event = await getEventDetail(req.params.id);

        if (!event) {
            res.status(404).json(errorResponse('Event not found'));
            return;
        }

        res.status(200).json(successResponse(event));
    } catch (err) {
        next(err);
    }
}


// PUT /api/events/:id
export async function updateEventHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const validationError = validateUpdateEvent(req.body);
        if (validationError) {
            res.status(400).json(errorResponse(validationError));
            return;
        }

        const event = await updateEvent(req.params.id, req.auth!.userId, req.body);
        res.status(200).json(successResponse(event));
    } catch (err) {
        next(err);
    }
}

// DELETE /api/events/:id
export async function deleteEventHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await deleteEvent(req.params.id, req.auth!.userId);
        res.status(200).json(successResponse({ id: req.params.id }));
    } catch (err) {
        next(err);
    }
}
