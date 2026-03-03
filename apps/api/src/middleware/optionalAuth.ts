import { verifyToken } from '@clerk/backend';
import type { Response, NextFunction } from 'express';
import { env } from '../config/env';
import type { AuthenticatedRequest } from './requireAuth';

export async function optionalAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.slice(7); // strip 'Bearer '

    try {
        const payload = await verifyToken(token, {
            secretKey: env.CLERK_SECRET_KEY,
        });

        req.auth = {
            userId: payload.sub,
            sessionId: payload.sid ?? '',
        };
    } catch (err) {
        // Since auth is optional, we just ignore expired/invalid tokens and treat them as guests.
        console.warn('[OptionalAuth] Token verification failed:', err instanceof Error ? err.message : err);
    }

    next();
}
