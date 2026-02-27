// requireAuth.ts
// Verifies Clerk Bearer JWT tokens for Express API routes.
// Uses verifyToken() — the correct approach for REST API backends.
// authenticateRequest() is for Next.js middleware (session cookies), not APIs.

import { createClerkClient } from '@clerk/backend';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

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
        // verifyToken() is the correct method for Express REST API JWT verification.
        // It verifies the Clerk-issued JWT directly using the secret key.
        const payload = await clerk.verifyToken(token);

        req.auth = {
            userId: payload.sub,           // Clerk userId is in the 'sub' claim
            sessionId: payload.sid ?? '',     // session id
        };

        next();
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Token verification failed';
        res.status(401).json({ success: false, error: `Unauthorized: ${message}` });
    }
}
