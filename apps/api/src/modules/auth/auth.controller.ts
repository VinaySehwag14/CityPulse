// auth.controller.ts
// HTTP layer only. Fetches Clerk user profile, delegates to auth.service, returns response.
// No database access here per AI_RULES.md §1 & ARCHITECTURE.md.

import { createClerkClient } from '@clerk/backend';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/requireAuth';
import { upsertUser } from './auth.service';
import { successResponse } from '../../utils';
import { env } from '../../config/env';

const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

// POST /api/auth/sync
export async function syncUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { userId } = req.auth!;

        // Fetch authoritative user data from Clerk — never trust the request body (AI_RULES §9)
        const clerkUser = await clerkClient.users.getUser(userId);

        const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';
        const firstName = clerkUser.firstName ?? '';
        const lastName = clerkUser.lastName ?? '';
        const name = `${firstName} ${lastName}`.trim() || email;
        const avatar = clerkUser.imageUrl ?? null;

        const user = await upsertUser({
            clerkId: userId,
            email,
            name,
            avatar,
        });

        res.status(200).json(successResponse(user));
    } catch (err) {
        next(err);
    }
}
