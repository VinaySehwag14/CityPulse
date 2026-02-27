'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

interface ChatMsg {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export default function ChatWindow({ eventId }: { eventId: string }) {
    const { getToken, isSignedIn } = useAuth();
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState('');
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState('');
    const wsRef = useRef<WebSocket | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const connect = useCallback(async () => {
        const token = await getToken();
        if (!token) return;

        const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')?.replace('/api', '')}/chat/${eventId}?token=${token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => setConnected(true);
        ws.onclose = () => setConnected(false);
        ws.onerror = () => setError('Connection error');
        ws.onmessage = (e) => {
            try {
                const parsed = JSON.parse(e.data as string) as { type: string; data: ChatMsg; error?: string };
                if (parsed.error) { setError(parsed.error); return; }
                if (parsed.type === 'message') {
                    setMessages((prev) => [parsed.data, ...prev].slice(0, 100));
                    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
            } catch { /* ignore malformed */ }
        };

        return () => ws.close();
    }, [eventId, getToken]);

    useEffect(() => {
        if (isSignedIn) {
            const cleanup = connect();
            return () => { cleanup.then((fn) => fn?.()); };
        }
    }, [isSignedIn, connect]);

    const send = () => {
        if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(JSON.stringify({ content: input.trim() }));
        setInput('');
    };

    if (!isSignedIn) return null;

    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                <h2 className="text-sm font-semibold text-[#e6edf3]">Event Lobby</h2>
                <span className={`flex items-center gap-1.5 text-xs ${connected ? 'text-[#22c55e]' : 'text-[#8b949e]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#22c55e] live-dot' : 'bg-[#8b949e]'}`} />
                    {connected ? 'Live' : 'Connecting…'}
                </span>
            </div>

            <div className="h-48 overflow-y-auto flex flex-col-reverse px-4 py-3 space-y-reverse space-y-2">
                {messages.length === 0 && (
                    <p className="text-xs text-[#8b949e] text-center py-4">No messages yet</p>
                )}
                {messages.map((m) => (
                    <div key={m.id} className="text-sm text-[#e6edf3]">
                        <span className="text-[#0caee8] font-medium mr-2">{m.user_id.slice(0, 6)}</span>
                        {m.content}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {error && <p className="text-xs text-red-400 px-4 py-1">{error}</p>}

            <div className="flex gap-2 px-4 py-3 border-t border-[#30363d]">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="Say something…"
                    maxLength={1000}
                    className="flex-1 bg-[#1c2128] border border-[#30363d] rounded-xl px-3 py-2 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors"
                />
                <Button size="sm" onClick={send} disabled={!connected || !input.trim()}>Send</Button>
            </div>
        </div>
    );
}
