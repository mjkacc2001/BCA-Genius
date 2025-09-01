
import React, { useState, useRef, useEffect } from 'react';
import type { User, Message } from '../types';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';
import { SendIcon, LogoutIcon, LogoIcon } from './IconComponents';

interface ChatScreenProps {
  user: User;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (prompt: string) => void;
  onLogout: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, messages, isLoading, onSendMessage, onLogout }) => {
  const [input, setInput] = useState('');
  const [isProfileOpen, setProfileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <header className="flex items-center justify-between p-4 bg-surface/80 backdrop-blur-sm shadow-md z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8 text-primary"/>
            <h1 className="text-xl font-bold text-text-primary">BCA Genius</h1>
        </div>
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(!isProfileOpen)} className="rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary">
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full"/>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface rounded-lg shadow-xl border border-white/10 p-4 animate-fade-in-down">
              <div className="flex items-center gap-3 mb-4">
                <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full"/>
                <div>
                  <p className="font-semibold text-text-primary">{user.name}</p>
                  <p className="text-sm text-text-secondary">{user.email}</p>
                </div>
              </div>
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-left p-2 rounded-md hover:bg-white/5 transition-colors">
                <LogoutIcon className="w-5 h-5 text-text-secondary"/>
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} user={user} onSuggestionClick={handleSuggestionClick} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-primary rounded-full flex items-center justify-center">
                    <LogoIcon className="w-6 h-6 text-white"/>
                </div>
                <div className="bg-surface p-4 rounded-lg rounded-bl-none">
                    <LoadingSpinner />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-surface/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center bg-surface rounded-lg overflow-hidden shadow-lg border border-white/10 focus-within:ring-2 focus-within:ring-primary">
            <textarea
              className="flex-1 p-4 bg-transparent text-text-primary placeholder-text-secondary focus:outline-none resize-none"
              placeholder="Ask a computer science question..."
              value={input}
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="p-4 text-white bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatScreen;