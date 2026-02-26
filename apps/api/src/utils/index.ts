// utils/index.ts
// Pure utility functions only. No business logic.

/**
 * Creates a standardized API response shape.
 * All endpoints must use this format per AI_RULES.md §7.
 */
export function successResponse<T>(data: T): { success: true; data: T } {
    return { success: true, data };
}

export function errorResponse(error: string): { success: false; error: string } {
    return { success: false, error };
}
