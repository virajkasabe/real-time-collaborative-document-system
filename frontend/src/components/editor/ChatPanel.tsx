import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatPanelProps {
  socket: any;
  documentId: string;
  user: any;
}

export default function ChatPanel({ socket, documentId, user }: ChatPanelProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = (message: string) => {
    if (!socket || !message.trim()) return;
    socket.emit('send-chat', {
      documentId,
      message,
      user: { name: user.fullName, email: user.email, avatar: user.avatar }
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleChatReceived = (msg: any) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('chat-received', handleChatReceived);

    return () => {
      socket.off('chat-received', handleChatReceived);
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-white/10 w-80 shrink-0">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-slate-950">
        <span className="text-sm font-bold text-white">Team Chat</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-900">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${
            msg.sender?.email === user.email ? 'flex-row-reverse' : ''
          }`}>
            <div className="w-7 h-7 rounded-full bg-blue-600 
              flex items-center justify-center text-xs text-white flex-shrink-0 font-bold uppercase">
              {msg.sender?.name?.charAt(0) || 'U'}
            </div>
            <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-xs leading-normal break-words ${
              msg.sender?.email === user.email
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white/10 text-white rounded-tl-none'
            }`}>
              {msg.sender?.email !== 'system@collabdocs.com' && msg.sender?.email && (
                <div className="text-[9px] text-white/40 mb-0.5 font-semibold">
                  {msg.sender?.name}
                </div>
              )}
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-white/10 flex gap-2 bg-slate-950">
        <input
          className="flex-1 bg-white/5 border border-white/10
            rounded-xl px-3 py-2 text-xs text-white
            placeholder-gray-500 focus:outline-none
            focus:ring-1 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              sendMessage(input.trim());
              setInput('');
            }
          }}
        />
        <button
          onClick={() => { sendMessage(input.trim()); setInput(''); }}
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40
            text-white px-3 py-2 rounded-xl transition cursor-pointer"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
