// events module – controller stub
// Phase 1: Event CRUD (no feed logic, no geo search)
import type { Request, Response, NextFunction } from 'express';

// POST /api/events
export async function createEvent(
    _req: Request,
    _res: Response,
    _next: NextFunction
): Promise<void> {
    throw new Error('Not implemented');
}

// GET /api/events/:id
export async function getEventById(
    _req: Request,
    _res: Response,
    _next: NextFunction
): Promise<void> {
    throw new Error('Not implemented');
}

// PUT /api/events/:id
export async function updateEvent(
    _req: Request,
    _res: Response,
    _next: NextFunction
): Promise<void> {
    throw new Error('Not implemented');
}

// DELETE /api/events/:id
export async function deleteEvent(
    _req: Request,
    _res: Response,
    _next: NextFunction
): Promise<void> {
    throw new Error('Not implemented');
}
