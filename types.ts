
export interface User {
  name: string;
  email: string;
  picture: string;
}

export enum MessageType {
  TEXT = 'text',
  SUGGESTION = 'suggestion',
  ERROR = 'error',
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  type: MessageType;
  content?: string;
  suggestions?: string[];
}