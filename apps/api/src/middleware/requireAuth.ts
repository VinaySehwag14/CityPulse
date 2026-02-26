import { createClerkClient } from '@clerk/backend';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

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
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
            return;
        }

        const token = authHeader.split(' ')[1];

        const requestState = await clerkClient.authenticateRequest(req as unknown as Request, {
            headerToken: token,
        });

        if (!requestState.isSignedIn) {
            res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
            return;
        }

        const { userId, sessionId } = requestState.toAuth();

        req.auth = { userId, sessionId };

        next();
    } catch {
        res.status(401).json({ success: false, error: 'Unauthorized: Token verification failed' });
    }
}
