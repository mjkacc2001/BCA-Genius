
import React from 'react';
import type { Message, User } from '../types';
import { MessageType } from '../types';
import SuggestionChip from './SuggestionChip';
import { LogoIcon } from './IconComponents';

interface ChatMessageProps {
  message: Message;
  user: User;
  onSuggestionClick: (suggestion: string) => void;
}

// Simple markdown-to-HTML converter with improved styling
const FormattedContent: React.FC<{ content: string }> = React.memo(({ content }) => {
    const format = (text: string) => {
        // Bold: **text**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic: *text*
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Code block: ```code```
        text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-black/50 text-sm text-white/90 p-3 my-2 rounded-md overflow-x-auto"><code>$1</code></pre>');
        // Inline code: `code`
        text = text.replace(/`([^`]+)`/g, '<code class="bg-black/50 text-accent-light px-1.5 py-0.5 rounded text-sm">$1</code>');
        return text.replace(/\n/g, '<br />');
    }
    return <div dangerouslySetInnerHTML={{ __html: format(content) }} className="prose prose-invert max-w-none prose-p:text-text-primary prose-strong:text-white prose-em:text-white/90" />;
});

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user, onSuggestionClick }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center">
        {isUser ? (
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
        ) : (
            <div className="w-10 h-10 flex-shrink-0 bg-primary rounded-full flex items-center justify-center">
                <LogoIcon className="w-6 h-6 text-white" />
            </div>
        )}
      </div>
      <div
        className={`max-w-xl p-4 rounded-lg shadow-md ${
          isUser ? 'bg-primary text-white rounded-br-none' : 'bg-surface text-text-primary rounded-bl-none'
        }`}
      >
        {message.type === MessageType.TEXT && message.content && (
            <FormattedContent content={message.content} />
        )}

        {message.type === MessageType.SUGGESTION && message.suggestions && (
          <div className="mt-2">
            <p className="font-semibold mb-3 text-text-secondary">Here are some follow-up questions:</p>
            <div className="flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, index) => (
                <SuggestionChip key={index} text={suggestion} onClick={() => onSuggestionClick(suggestion)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;