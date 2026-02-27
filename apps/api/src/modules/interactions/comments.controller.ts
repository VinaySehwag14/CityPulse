// comments.controller.ts
// HTTP layer only.

import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/requireAuth';
import { validateAndSanitizeComment } from './comments.validation';
import { addComment, getComments } from './comments.service';
import { successResponse, errorResponse } from '../../utils';

// POST /api/events/:id/comments
export async function addCommentHandler(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { error, content } = validateAndSanitizeComment(req.body);
        if (error) {
            res.status(400).json(errorResponse(error));
            return;
        }

        const comment = await addComment(req.auth!.userId, req.params.id, content);
        res.status(201).json(successResponse(comment));
    } catch (err) {
        next(err);
    }
}

// GET /api/events/:id/comments
export async function getCommentsHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const comments = await getComments(req.params.id);
        res.status(200).json(successResponse(comments));
    } catch (err) {
        next(err);
    }
}
