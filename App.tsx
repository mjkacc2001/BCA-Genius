
import React, { useState, useCallback } from 'react';
import type { User, Message } from './types';
import { MessageType } from './types';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';
import { getAnswerAndSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setMessages([
      {
        id: 'initial-bot-message',
        sender: 'bot',
        type: MessageType.TEXT,
        content: `Hello ${loggedInUser.name}! I am BCA Genius, your personal AI assistant. How can I help you with your Computer Science studies today?`,
      },
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
  };

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: MessageType.TEXT,
      content: prompt,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await getAnswerAndSuggestions(prompt);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: MessageType.TEXT,
        content: result.answer,
      };
      const suggestionMessage: Message = {
        id: `suggestions-${Date.now()}`,
        sender: 'bot',
        type: MessageType.SUGGESTION,
        suggestions: result.suggestions,
      };
      setMessages(prev => [...prev, botMessage, suggestionMessage]);
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      const errorMessageContent = error instanceof Error ? error.message : "An unknown error occurred. Please check the console for details.";
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        type: MessageType.ERROR,
        content: `I'm sorry, I encountered an issue. ${errorMessageContent}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ChatScreen
      user={user}
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onLogout={handleLogout}
    />
  );
};

export default App;