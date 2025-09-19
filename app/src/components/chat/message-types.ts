export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
  isRead: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size?: number;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  timestamp: Date;
}