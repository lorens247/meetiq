import { useState, useEffect, useCallback } from 'react';
import { Message, User, TypingIndicator } from '@/components/chat/message-types';

interface UseChatMessagesProps {
  roomId: string;
  currentUser: User;
}

export const useChatMessages = ({ roomId, currentUser }: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Mock initial messages
  useEffect(() => {
    const mockUsers = [
      { id: 'user1', name: 'Jane Smith', avatar: '' },
      { id: 'user2', name: 'John Doe', avatar: '' },
    ];
    
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hello everyone! Welcome to the meeting.',
        sender: mockUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        isRead: true,
      },
      {
        id: '2',
        content: 'Thanks for joining. Let\'s discuss the project timeline.',
        sender: mockUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        isRead: true,
      },
      {
        id: '3',
        content: 'I\'ve prepared some slides to share with you all.',
        sender: mockUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: true,
      }
    ];
    
    setMessages(mockMessages);
  }, [roomId]);
  
  // Send a new message
  const sendMessage = useCallback((content: string, attachments?: any[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
      attachments: attachments?.map((att, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: att.name,
        url: URL.createObjectURL(att),
        type: att.type.startsWith('image/') ? 'image' : 'document',
        size: att.size
      }))
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate receiving a response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: 'Thanks for your message! I\'ll look into it.',
        sender: { id: 'user1', name: 'Jane Smith', avatar: '' },
        timestamp: new Date(),
        isRead: false,
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setUnreadCount(prev => prev + 1);
    }, 5000);
    
    return newMessage;
  }, [currentUser]);
  
  // Mark messages as read
  const markMessagesAsRead = useCallback(() => {
    setMessages(prev => 
      prev.map(message => ({ ...message, isRead: true }))
    );
    setUnreadCount(0);
  }, []);
  
  // Set user as typing
  const setUserTyping = useCallback((isTyping: boolean) => {
    if (isTyping) {
      const typingIndicator: TypingIndicator = {
        userId: currentUser.id,
        userName: currentUser.name,
        timestamp: new Date()
      };
      
      setTypingUsers(prev => [...prev.filter(u => u.userId !== currentUser.id), typingIndicator]);
      
      // Simulate other user typing after a delay
      setTimeout(() => {
        const otherTypingIndicator: TypingIndicator = {
          userId: 'user1',
          userName: 'Jane Smith',
          timestamp: new Date()
        };
        
        setTypingUsers(prev => [...prev.filter(u => u.userId !== 'user1'), otherTypingIndicator]);
        
        // And stop typing after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u.userId !== 'user1'));
        }, 3000);
      }, 1000);
    } else {
      setTypingUsers(prev => prev.filter(u => u.userId !== currentUser.id));
    }
  }, [currentUser]);
  
  // Clean up typing indicators after 5 seconds of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const fiveSecondsAgo = new Date(Date.now() - 5000);
      setTypingUsers(prev => 
        prev.filter(user => user.timestamp > fiveSecondsAgo)
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    messages,
    typingUsers,
    unreadCount,
    sendMessage,
    markMessagesAsRead,
    setUserTyping
  };
};

export default useChatMessages;