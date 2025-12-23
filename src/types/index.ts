export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  personaId?: string;
  errorMessage?: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  gender: string;
  age: number;
  background: string;
  personality: string;
  interests: string[];
  communicationStyle: string;
  distinctiveTraits: string[];
  prompt: string;
}

export interface Settings {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  customModels: string[];
}

export interface ChatSession {
  id: string;
  personaId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}