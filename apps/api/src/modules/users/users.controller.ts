// users module – controller stub
import type { Request, Response, NextFunction } from 'express';

// GET /api/users/:id
export async function getUserById(
    _req: Request,
    _res: Response,
    _next: NextFunction
): Promise<void> {
    throw new Error('Not implemented');
}
