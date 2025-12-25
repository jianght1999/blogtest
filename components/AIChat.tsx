
import React, { useState, useRef, useEffect } from 'react';
import { geminiAssistant } from '../services/geminiService.ts';
import { Message } from '../types.ts';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "SYSTEM ONLINE. 我是 Alex 的数字助手。请问有什么可以帮您？", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await geminiAssistant.getChatResponse(input, history);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "ERROR: 连接中断。", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      {isOpen && (
        <div className="w-80 md:w-96 h-[550px] mb-6 border border-black bg-white flex flex-col shadow-2xl animate-fade">
          <div className="p-6 border-b border-black flex justify-between items-center bg-black text-white">
            <div className="flex items-center space-x-3">
              <span className="block font-black text-[10px] tracking-[0.3em] uppercase">Alex.Core_AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black border border-slate-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="text-[10px] font-black tracking-widest uppercase animate-pulse">Thinking...</div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-black">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="INPUT COMMAND..."
                className="flex-1 bg-transparent border-none py-2 text-xs font-mono focus:outline-none uppercase"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="font-black text-[10px] tracking-widest uppercase hover:underline disabled:opacity-20"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black text-white flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
};
