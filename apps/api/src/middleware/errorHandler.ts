import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    const statusCode = err.statusCode ?? 500;

    // In production, never leak internal error messages for 5xx responses.
    // Known AppErrors with explicit statusCode are safe to expose (4xx messages
    // are authored by us, not from DB or third-party libraries).
    const isKnownError = err.statusCode !== undefined && err.statusCode < 500;
    const message = isKnownError
        ? err.message
        : process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message;

    // Log the full error including stack in all environments (server-side only)
    console.error(`[ErrorHandler] ${statusCode} – ${err.message}`);
    if (statusCode >= 500) console.error(err.stack);

    res.status(statusCode).json({
        success: false,
        error: message,
    });
}
