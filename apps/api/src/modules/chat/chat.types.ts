// chat.types.ts

export interface ChatMessage {
    id: string;
    event_id: string;
    user_id: string;
    content: string;
    created_at: Date;
}

export interface WsIncomingMessage {
    content: string;
}
