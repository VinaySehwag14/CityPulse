import http from 'http';
import app from './app';
import { env } from './config/env';
import { createChatWsServer, handleUpgrade } from './modules/chat/chat.ws';

const { PORT } = env;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach WebSocket server for event lobby chat (Phase 3)
// Route: ws://host/chat/:eventId?token=<clerk-token>
const wss = createChatWsServer();

server.on('upgrade', (req, socket, head) => {
    handleUpgrade(wss, req, socket as import('stream').Duplex, head);
});

server.listen(PORT, () => {
    console.log(`[server] CityPulse API running on port ${PORT} (${env.NODE_ENV})`);
    console.log(`[server] WebSocket chat available at ws://localhost:${PORT}/chat/:eventId`);
});
