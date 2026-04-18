import React from 'react';
import { ChatMessage as TChatMessage } from '../types';

interface ChatMessageProps {
  message: TChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const messageClasses = isBot
    ? 'bg-blue-100 text-blue-900 self-start rounded-br-lg'
    : 'bg-green-100 text-green-900 self-end rounded-bl-lg';

  const animationClass = message.isAnimatedConfirmation ? 'animated-confirmation-message' : '';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`px-4 py-2 max-w-[80%] rounded-xl shadow-sm ${messageClasses} ${animationClass}`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;