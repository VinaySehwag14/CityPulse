// comments.types.ts

export interface Comment {
    id: string;
    user_id: string;
    event_id: string;
    content: string;
    created_at: Date;
}
