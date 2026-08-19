import React, { useEffect, useRef, useState } from 'react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { subscribeToMessages, sendMessage, BookingMessage } from '../../lib/firestoreMessages';
import { Send, MessageSquare } from 'lucide-react';

interface BookingChatProps {
  booking: Booking;
}

/**
 * Live chat thread scoped to one booking. Only rendered when Firebase is
 * configured (see BookingDetailPage) — messages are Firestore-only, no
 * localStorage fallback, same reasoning as lib/firestoreMessages.ts.
 */
export const BookingChat: React.FC<BookingChatProps> = ({ booking }) => {
  const { userSession, currentRole } = useApp();
  const [messages, setMessages] = useState<BookingMessage[]>([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(booking.id, setMessages);
    return unsubscribe;
  }, [booking.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !userSession || currentRole === 'admin') return;

    setIsSending(true);
    setText('');
    await sendMessage(
      booking.id,
      booking.residentId,
      booking.artisanId,
      userSession.id,
      userSession.name,
      currentRole,
      trimmed
    );
    setIsSending(false);
  };

  return (
    <div className="bg-white rounded-artiva-lg border border-slate-200 shadow-artiva-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-artiva-teal" />
        <h3 className="text-sm font-bold text-slate-900">Messages</h3>
      </div>

      <div className="max-h-72 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">No messages yet — say hello.</p>
        )}
        {messages.map((m) => {
          const isMine = m.senderId === userSession?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-artiva px-3 py-2 text-xs ${
                  isMine ? 'bg-artiva-teal text-white' : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                {!isMine && <p className="font-bold text-[10px] mb-0.5 opacity-70">{m.senderName}</p>}
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {currentRole !== 'admin' && (
        <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-slate-100">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-artiva border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-artiva-teal focus:ring-1 focus:ring-artiva-teal outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim() || isSending}
            className="p-2 rounded-artiva bg-artiva-teal text-white disabled:opacity-50 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
