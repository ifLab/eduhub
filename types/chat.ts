import { OpenAIModel } from './openai';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
  conversationID: string;
}

export interface Conversation {
  id: string;
  name: string;
  originalName: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  temperature: number;
  folderId: string | null;
  conversationID: string; // Dify Conversation ID
}

