import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { ChatMessage } from '../types';
import { getShoppingAdvice } from '../services/geminiService';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Cześć! Jestem Twoim wirtualnym doradcą LEGO. Szukasz prezentu czy czegoś dla siebie? Powiedz mi, co Cię interesuje!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const responseText = await getShoppingAdvice(userMsg);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[100] p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 border-4 border-white ${isOpen ? 'scale-0 opacity-0' : 'bg-yellow-400 text-red-600 scale-100 opacity-100'}`}
        aria-label="Otwórz asystenta AI"
      >
        <Bot size={32} strokeWidth={2.5} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] w-[90vw] sm:w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 flex justify-between items-center text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot size={24} className="text-yellow-300" />
            </div>
            <div>
                <h3 className="font-black leading-tight">LEGO AI</h3>
                <span className="text-xs text-red-100 opacity-90">Twój wirtualny ekspert</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white self-end rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-white border border-gray-200 text-gray-500 text-xs px-4 py-3 rounded-2xl rounded-bl-none animate-pulse flex items-center gap-2">
              <Loader2 className="animate-spin w-3 h-3" /> Piszę...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Zapytaj o zestaw..."
            className="flex-1 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-yellow-400 focus:outline-none rounded-xl text-sm px-4 py-3 transition-colors text-gray-900 font-medium placeholder-gray-400"
          />
          <Button 
            variant="primary" 
            size="md" // Slightly bigger button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="!rounded-xl shadow-none"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </>
  );
};