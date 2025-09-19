'use client';

import React from 'react';
import { format } from 'date-fns';
import { Message } from './message-types';
import { cn } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageItem = ({ message, isCurrentUser }: MessageItemProps) => {
  return (
    <div className={cn(
      'flex mb-4',
      isCurrentUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[70%] rounded-lg px-4 py-2',
        isCurrentUser 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 dark:bg-slate-700 rounded-bl-none'
      )}>
        {!isCurrentUser && (
          <div className="font-medium text-xs mb-1">
            {message.sender.name}
          </div>
        )}
        
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map(attachment => (
              <div key={attachment.id} className="rounded overflow-hidden">
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="max-h-40 w-auto object-contain"
                  />
                ) : (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 bg-white/10 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs truncate">{attachment.name}</span>
                    {attachment.size && (
                      <span className="text-xs ml-2">
                        ({Math.round(attachment.size / 1024)}KB)
                      </span>
                    )}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-xs mt-1 opacity-70 flex items-center justify-end gap-1">
          {format(new Date(message.timestamp), 'HH:mm')}
          {isCurrentUser && (
            <span>
              {message.isRead ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;