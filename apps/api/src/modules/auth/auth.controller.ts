// auth module – controller stub
// Business logic lives in auth.service.ts
// Controllers handle HTTP I/O only.

import type { Request, Response, NextFunction } from 'express';

// POST /api/auth/sync
export async function syncUser(
    _req: Request,
    _res: Response,
    _next: NextFunction
): Promise<void> {
    // TODO: Phase 1 – delegate to auth.service.syncUser()
    throw new Error('Not implemented');
}
