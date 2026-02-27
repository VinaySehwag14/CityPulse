// chat.ws.ts
// WebSocket server for event lobby chat.
// Per FEATURES.md §6: room per event, active-event guard, message broadcast.
// Per AI_RULES.md §9: Clerk JWT verified on connect via query param.

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { createClerkClient } from '@clerk/backend';
import { env } from '../../config/env';
import { isEventActive, saveMessage } from './chat.service';
import type { WsIncomingMessage } from './chat.types';

const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

// Rooms: eventId → Set of connected WebSockets (with userId attached)
interface AuthenticatedSocket extends WebSocket {
    userId?: string;
    eventId?: string;
}

const rooms = new Map<string, Set<AuthenticatedSocket>>();

function joinRoom(eventId: string, ws: AuthenticatedSocket): void {
    if (!rooms.has(eventId)) rooms.set(eventId, new Set());
    rooms.get(eventId)!.add(ws);
}

function leaveRoom(eventId: string, ws: AuthenticatedSocket): void {
    rooms.get(eventId)?.delete(ws);
    if (rooms.get(eventId)?.size === 0) rooms.delete(eventId);
}

function broadcast(eventId: string, data: object, exclude?: WebSocket): void {
    const room = rooms.get(eventId);
    if (!room) return;
    const payload = JSON.stringify(data);
    room.forEach((client) => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

export function createChatWsServer(): WebSocketServer {
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws: AuthenticatedSocket, _req: IncomingMessage) => {
        ws.on('message', async (raw) => {
            try {
                if (!ws.userId || !ws.eventId) {
                    ws.close(1008, 'Not authenticated');
                    return;
                }

                // Active-event guard per FEATURES.md §6
                const active = await isEventActive(ws.eventId);
                if (!active) {
                    ws.send(JSON.stringify({ error: 'Event lobby is closed' }));
                    return;
                }

                const parsed = JSON.parse(raw.toString()) as WsIncomingMessage;
                const content = (parsed.content ?? '').trim();

                if (!content || content.length > 1000) {
                    ws.send(JSON.stringify({ error: 'Message content invalid' }));
                    return;
                }

                const message = await saveMessage(ws.userId, ws.eventId, content);

                // Broadcast to all room members including sender
                broadcast(ws.eventId, { type: 'message', data: message });
            } catch {
                ws.send(JSON.stringify({ error: 'Failed to process message' }));
            }
        });

        ws.on('close', () => {
            if (ws.eventId) leaveRoom(ws.eventId, ws);
        });
    });

    return wss;
}

// Called from server.ts to upgrade HTTP → WS with auth + event routing
export async function handleUpgrade(
    wss: WebSocketServer,
    req: IncomingMessage,
    socket: import('stream').Duplex,
    head: Buffer
): Promise<void> {
    try {
        // URL format: /chat/:eventId?token=<clerk-session-token>
        const url = new URL(req.url ?? '', `http://${req.headers.host}`);
        const pathParts = url.pathname.split('/').filter(Boolean);

        // Expect: /chat/:eventId
        if (pathParts[0] !== 'chat' || !pathParts[1]) {
            socket.destroy();
            return;
        }

        const eventId = pathParts[1];
        const token = url.searchParams.get('token');

        if (!token) {
            socket.destroy();
            return;
        }

        // Verify Clerk JWT
        const requestState = await clerkClient.authenticateRequest(
            new globalThis.Request('http://localhost', {
                headers: { authorization: `Bearer ${token}` },
            })
        );

        if (!requestState.isSignedIn) {
            socket.destroy();
            return;
        }

        const auth = requestState.toAuth();
        if (!auth.userId) {
            socket.destroy();
            return;
        }

        // Check event is active before allowing join
        const active = await isEventActive(eventId);
        if (!active) {
            socket.destroy();
            return;
        }

        wss.handleUpgrade(req, socket, head, (ws) => {
            const authWs = ws as AuthenticatedSocket;
            authWs.userId = auth.userId ?? undefined;
            authWs.eventId = eventId;
            joinRoom(eventId, authWs);
            wss.emit('connection', authWs, req);
        });
    } catch {
        socket.destroy();
    }
}
