// Shared domain types for the users module.
// Must match DATABASE.md users table exactly. Do not add columns not defined there.

export interface User {
    id: string;
    clerk_id: string;
    email: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    created_at: Date;
}

export interface UpsertUserPayload {
    clerkId: string;
    email: string;
    name: string;
    avatar: string | null;
}
