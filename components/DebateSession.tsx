import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, LanguageCode } from '../types';
import { createDebateChat } from '../services/geminiService';

interface DebateSessionProps {
  userName: string;
  contextData: string;
  language: LanguageCode;
  onEndDebate: () => void;
  t: any;
}

const DebateSession: React.FC<DebateSessionProps> = ({ userName, contextData, language, onEndDebate, t }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat
    chatSessionRef.current = createDebateChat(userName, contextData, language);
    
    // Initial greeting from Marcus
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: t.debateInit
      }
    ]);
  }, [userName, contextData, language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userText = input.trim();
    setInput('');

    // Add user message
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userText });
      const aiText = response.text || "Marcus diam.";

      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiText
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: t.error
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-stone-900 text-stone-200 fade-in pt-16">
      {/* Header - Fixed Below Main App Header */}
      <div className="p-4 bg-stone-800 border-b border-stone-700 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-stone-300">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.756a49.106 49.106 0 019.152 1 .75.75 0 01-.152 1.485h-1.918l2.478 13.626a2.25 2.25 0 01-2.214 2.633H3.904a2.25 2.25 0 01-2.214-2.633L4.168 6.241H2.25a.75.75 0 01-.152-1.485 49.105 49.105 0 019.152-1V3a.75.75 0 01.75-.75zm4.878 13.5l-1.727-9.501H8.85l-1.727 9.501h9.755z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif font-bold text-white">{t.debateHeader}</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              {t.debateOnline}
            </p>
          </div>
        </div>
        <button onClick={onEndDebate} className="text-stone-400 hover:text-white text-sm uppercase tracking-wider">
          {t.debateEnd}
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-900 scrollbar-hide">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-stone-700 text-white rounded-tr-none' 
                  : 'bg-stone-800 text-stone-300 rounded-tl-none border border-stone-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-stone-800 p-3 rounded-2xl rounded-tl-none border border-stone-700 flex items-center gap-1">
               <div className="w-2 h-2 bg-stone-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-stone-500 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-stone-500 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-stone-800 border-t border-stone-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.debatePlaceholder}
            className="flex-1 bg-stone-900 text-white border border-stone-600 rounded-full px-4 py-3 focus:outline-none focus:border-stone-400 placeholder-stone-600"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-stone-200 hover:bg-white text-stone-900 rounded-full p-3 disabled:opacity-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DebateSession;
