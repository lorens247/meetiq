'use client';

import React from 'react';
import { TypingIndicator as TypingIndicatorType } from './message-types';

interface TypingIndicatorProps {
  typingUsers: TypingIndicatorType[];
}

export const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  if (typingUsers.length === 0) return null;
  
  const typingText = typingUsers.length === 1
    ? `${typingUsers[0].userName} is typing...`
    : typingUsers.length === 2
      ? `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`
      : `${typingUsers.length} people are typing...`;
  
  return (
    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 p-2">
      <div className="flex space-x-1 mr-2">
        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      {typingText}
    </div>
  );
};

export default TypingIndicator;