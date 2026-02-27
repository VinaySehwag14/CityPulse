// requireAuth.ts
// Verifies Clerk Bearer JWT tokens for Express REST API routes.
// Uses the standalone verifyToken() import from @clerk/backend — correct
// for Express APIs. authenticateRequest() is Next.js-only (session cookies).

import { verifyToken } from '@clerk/backend';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AuthenticatedRequest extends Request {
    auth?: {
        userId: string;
        sessionId: string;
    };
}

export async function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
        return;
    }

    const token = authHeader.slice(7); // strip 'Bearer '

    try {
        // Standalone verifyToken() — correct for Express REST API Bearer JWT flow.
        // secretKey is required; it fetches Clerk's JWKS and verifies the signature.
        const payload = await verifyToken(token, {
            secretKey: env.CLERK_SECRET_KEY,
        });

        req.auth = {
            userId: payload.sub,       // Clerk userId is in JWT 'sub' claim
            sessionId: payload.sid ?? '', // session id
        };

        next();
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Token verification failed';
        res.status(401).json({ success: false, error: `Unauthorized: ${message}` });
    }
}
