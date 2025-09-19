'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MessageItem } from './message-item';
import { MessageInput } from './message-input';
import { TypingIndicator } from './typing-indicator';
import { useChatMessages } from '@/hooks/useChatMessages';
import { User } from './message-types';
import { cn } from '@/lib/utils';

interface ChatBoxProps {
  roomId: string;
  currentUser: User;
  className?: string;
}

export const ChatBox = ({ roomId, currentUser, className }: ChatBoxProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    typingUsers,
    unreadCount,
    sendMessage,
    markMessagesAsRead,
    setUserTyping
  } = useChatMessages({ roomId, currentUser });
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        // Check if user is near bottom before scrolling
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        
        if (isNearBottom) {
          scrollToBottom();
          setHasNewMessages(false);
        } else {
          setHasNewMessages(true);
        }
      }
    }
  }, [messages]);
  
  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      
      if (isNearBottom && hasNewMessages) {
        setHasNewMessages(false);
        markMessagesAsRead();
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNewMessages, markMessagesAsRead]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (hasNewMessages) {
      markMessagesAsRead();
      setHasNewMessages(false);
    }
  };
  
  return (
    <div className={cn("flex flex-col h-full border rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800">
        <h3 className="font-medium">Chat</h3>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
            {unreadCount} new
          </span>
        )}
      </div>
      
      {/* Messages container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {messages.map(message => (
          <MessageItem 
            key={message.id}
            message={message}
            isCurrentUser={message.sender.id === currentUser.id}
          />
        ))}
        
        <TypingIndicator typingUsers={typingUsers} />
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={cn(
            "absolute bottom-20 right-4 rounded-full p-2 bg-blue-500 text-white shadow-md",
            hasNewMessages ? "animate-bounce" : ""
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {hasNewMessages && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}
      
      {/* Message input */}
      <MessageInput 
        onSendMessage={sendMessage}
        onTyping={setUserTyping}
      />
    </div>
  );
};

export default ChatBox;