// users.controller.ts
// HTTP layer only. Reads auth + params, calls service, returns response.

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/requireAuth';
import {
    getUserById,
    toggleFollow,
    getFollowers,
    getFollowing,
} from './users.service';
import { successResponse, errorResponse } from '../../utils';

// GET /api/users/:id
export async function getUserByIdHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            res.status(404).json(errorResponse('User not found'));
            return;
        }
        res.status(200).json(successResponse(user));
    } catch (err) {
        next(err);
    }
}

// POST /api/users/:id/follow – toggle follow (auth required)
export async function followUserHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await toggleFollow(req.auth!.userId, req.params.id);
        res.status(200).json(successResponse(result));
    } catch (err) {
        next(err);
    }
}

// GET /api/users/:id/followers
export async function getFollowersHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const followers = await getFollowers(req.params.id);
        res.status(200).json(successResponse(followers));
    } catch (err) {
        next(err);
    }
}

// GET /api/users/:id/following
export async function getFollowingHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const following = await getFollowing(req.params.id);
        res.status(200).json(successResponse(following));
    } catch (err) {
        next(err);
    }
}
