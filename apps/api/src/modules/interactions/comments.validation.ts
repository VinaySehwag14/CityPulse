// comments.validation.ts
// Pure validation + sanitization for comments. No HTTP, no DB.
// AI_RULES.md §9: sanitize comment inputs.

const MAX_CONTENT_LENGTH = 1000;

/**
 * Strips HTML tags from a string to prevent XSS storage.
 * Per AI_RULES.md §9 – sanitize comment inputs.
 */
function stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, '').trim();
}

export function validateAndSanitizeComment(body: unknown): {
    error: string | null;
    content: string;
} {
    const b = body as Record<string, unknown>;
    const raw = b.content;

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
        return { error: 'content is required', content: '' };
    }

    const sanitized = stripHtml(raw);

    if (sanitized.length === 0) {
        return { error: 'content cannot be empty after sanitization', content: '' };
    }

    if (sanitized.length > MAX_CONTENT_LENGTH) {
        return { error: `content must not exceed ${MAX_CONTENT_LENGTH} characters`, content: '' };
    }

    return { error: null, content: sanitized };
}
