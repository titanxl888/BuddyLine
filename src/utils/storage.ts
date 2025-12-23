import { Message, Settings, ChatSession, Persona } from '@/types';

const STORAGE_KEYS = {
  SETTINGS: 'buddline_settings',
  CHAT_SESSIONS: 'buddline_chat_sessions',
  CURRENT_PERSONA: 'buddline_current_persona',
  CUSTOM_PERSONAS: 'buddline_custom_personas',
} as const;

export const storage = {
  // Settings
  getSettings(): Settings {
    if (typeof window === 'undefined') return { apiKey: '', baseURL: 'https://api.openai.com/v1', model: 'gpt-4o-mini', temperature: 0.7, customModels: [] };
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : { apiKey: '', baseURL: 'https://api.openai.com/v1', model: 'gpt-4o-mini', temperature: 0.7, customModels: [] };
  },

  setSettings(settings: Settings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Chat Sessions
  getChatSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    if (!stored) return [];

    const sessions: ChatSession[] = JSON.parse(stored);

    // Convert date strings back to Date objects
    return sessions.map(session => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp),
      })),
    }));
  },

  setChatSessions(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
  },

  addChatSession(session: ChatSession): void {
    const sessions = this.getChatSessions();
    sessions.push(session);
    this.setChatSessions(sessions);
  },

  updateChatSession(sessionId: string, updates: Partial<ChatSession>): void {
    const sessions = this.getChatSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.setChatSessions(sessions);
    }
  },

  deleteChatSession(sessionId: string): void {
    const sessions = this.getChatSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    this.setChatSessions(filtered);
  },

  // Current Persona
  getCurrentPersonaId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PERSONA);
  },

  setCurrentPersonaId(personaId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_PERSONA, personaId);
  },

  // Custom Personas
  getCustomPersonas(): Persona[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_PERSONAS);
    return stored ? JSON.parse(stored) : [];
  },

  setCustomPersonas(personas: Persona[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PERSONAS, JSON.stringify(personas));
  },

  addCustomPersona(persona: Persona): void {
    const customPersonas = this.getCustomPersonas();
    customPersonas.push(persona);
    this.setCustomPersonas(customPersonas);
  },

  deleteCustomPersona(personaId: string): void {
    const customPersonas = this.getCustomPersonas();
    const filtered = customPersonas.filter(p => p.id !== personaId);
    this.setCustomPersonas(filtered);
  },

  updateCustomPersona(personaId: string, updates: Partial<Persona>): void {
    const customPersonas = this.getCustomPersonas();
    const index = customPersonas.findIndex(p => p.id === personaId);
    if (index !== -1) {
      customPersonas[index] = { ...customPersonas[index], ...updates };
      this.setCustomPersonas(customPersonas);
    }
  },
};