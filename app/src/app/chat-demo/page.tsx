'use client';

import React from 'react';
import { ChatBox } from '@/components/chat/chat-box';

export default function ChatDemo() {
  // Mock current user
  const currentUser = {
    id: 'current-user',
    name: 'You',
    avatar: ''
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat Component Demo</h1>
      <div className="flex flex-1 gap-4">
        <div className="w-full md:w-2/3 lg:w-1/2 h-[600px]">
          <ChatBox 
            roomId="demo-room"
            currentUser={currentUser}
            className="h-full"
          />
        </div>
        <div className="hidden md:block md:w-1/3 lg:w-1/2 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Real-time messaging with sender information and timestamps</li>
            <li>File attachment support (try uploading an image)</li>
            <li>Message formatting</li>
            <li>Typing indicators</li>
            <li>Read receipts</li>
            <li>Unread message notifications</li>
            <li>Scroll to bottom button for new messages</li>
          </ul>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Type a message and press Enter or click the send button. After a few seconds, 
              you&apos;ll receive an automated response. Try typing to see the typing indicator, 
              and scrolling away to see the new message notification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}