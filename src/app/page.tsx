'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, Persona, ChatSession } from '@/types';
import { personas as builtInPersonas } from '@/data/personas';
import { storage } from '@/utils/storage';
import { aiClient } from '@/utils/ai';
import { exportToTxt, exportToJson, generateTitle } from '@/utils/helpers';
import { useTheme } from '@/contexts/ThemeContext';
import ChatInterface from '@/components/ChatInterface';
import PersonaSelector from '@/components/PersonaSelector';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Combine built-in and custom personas
  const allPersonas = [...builtInPersonas, ...customPersonas];

  useEffect(() => {
    // Load custom personas
    const loadedCustomPersonas = storage.getCustomPersonas();
    setCustomPersonas(loadedCustomPersonas);

    // Load current persona
    const personaId = storage.getCurrentPersonaId();
    if (personaId) {
      const persona = allPersonas.find(p => p.id === personaId);
      if (persona) {
        setCurrentPersona(persona);
      }
    } else if (allPersonas.length > 0) {
      setCurrentPersona(allPersonas[0]);
      storage.setCurrentPersonaId(allPersonas[0].id);
    }

    // Load sessions
    const loadedSessions = storage.getChatSessions();
    setSessions(loadedSessions);

    // Create new session if none exists
    if (loadedSessions.length === 0) {
      createNewSession();
    } else {
      // Load the most recent session
      const recentSession = loadedSessions[loadedSessions.length - 1];
      setCurrentSessionId(recentSession.id);
      setMessages(recentSession.messages);
    }
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      personaId: currentPersona?.id || allPersonas[0].id,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    storage.addChatSession(newSession);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentPersona || !currentSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const responses = await aiClient.sendMessage(newMessages, currentPersona);

      // Add initial delay before showing first message (simulate thinking time)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      // Add messages one by one with delays between them
      let currentMessages = [...newMessages];
      for (let i = 0; i < responses.length; i++) {
        const aiMessage: Message = {
          id: `${Date.now()}-${i}`,
          role: 'assistant',
          content: responses[i],
          timestamp: new Date(),
          personaId: currentPersona.id,
        };

        currentMessages = [...currentMessages, aiMessage];
        setMessages(currentMessages);

        // Add delay between messages (except after the last one)
        if (i < responses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
        }
      }

      // Update session with all messages
      const updatedSession: ChatSession = {
        id: currentSessionId,
        personaId: currentPersona.id,
        messages: currentMessages,
        createdAt: sessions.find(s => s.id === currentSessionId)?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      storage.updateChatSession(currentSessionId, updatedSession);
      setSessions(prev => prev.map(s => s.id === currentSessionId ? updatedSession : s));

    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to user message
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id
          ? { ...msg, role: 'error' as const, errorMessage: errorMsg }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryMessage = async (messageId: string) => {
    const errorMessage = messages.find(msg => msg.id === messageId && msg.role === 'error');
    if (!errorMessage || !currentPersona || !currentSessionId) return;

    // Reset the error message to normal user message
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, role: 'user' as const, errorMessage: undefined } : msg
    );
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const responses = await aiClient.sendMessage(updatedMessages, currentPersona);

      // Add initial delay before showing first message (simulate thinking time)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      // Add messages one by one with delays between them
      let currentMessages = [...updatedMessages];
      for (let i = 0; i < responses.length; i++) {
        const aiMessage: Message = {
          id: `${Date.now()}-${i}`,
          role: 'assistant',
          content: responses[i],
          timestamp: new Date(),
          personaId: currentPersona.id,
        };

        currentMessages = [...currentMessages, aiMessage];
        setMessages(currentMessages);

        // Add delay between messages (except after the last one)
        if (i < responses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
        }
      }

      // Update session with all messages
      const updatedSession: ChatSession = {
        id: currentSessionId,
        personaId: currentPersona.id,
        messages: currentMessages,
        createdAt: sessions.find(s => s.id === currentSessionId)?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      storage.updateChatSession(currentSessionId, updatedSession);
      setSessions(prev => prev.map(s => s.id === currentSessionId ? updatedSession : s));

    } catch (error) {
      console.error('Error retrying message:', error);
      // Re-add error state
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, role: 'error' as const, errorMessage: errorMsg }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaChange = (persona: Persona) => {
    setCurrentPersona(persona);
    storage.setCurrentPersonaId(persona.id);
  };

  const handleAddCustomPersona = (persona: Persona) => {
    storage.addCustomPersona(persona);
    setCustomPersonas(prev => [...prev, persona]);
  };

  const handleDeleteCustomPersona = (personaId: string) => {
    // Check if the persona is being used in any sessions
    const sessionsUsingPersona = sessions.filter(s => s.personaId === personaId);
    if (sessionsUsingPersona.length > 0) {
      alert('Cannot delete persona that is being used in existing chat sessions.');
      return;
    }

    // If it's the current persona, switch to the first available persona
    if (currentPersona?.id === personaId) {
      const remainingPersonas = allPersonas.filter(p => p.id !== personaId);
      if (remainingPersonas.length > 0) {
        handlePersonaChange(remainingPersonas[0]);
      }
    }

    storage.deleteCustomPersona(personaId);
    setCustomPersonas(prev => prev.filter(p => p.id !== personaId));
  };

  const handleUpdateCustomPersona = (personaId: string, updates: Partial<Persona>) => {
    storage.updateCustomPersona(personaId, updates);
    setCustomPersonas(prev => prev.map(p =>
      p.id === personaId ? { ...p, ...updates } : p
    ));

    // If this is the current persona, update it
    if (currentPersona?.id === personaId) {
      setCurrentPersona(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      const persona = allPersonas.find(p => p.id === session.personaId);
      if (persona) {
        setCurrentPersona(persona);
        storage.setCurrentPersonaId(persona.id);
      }
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    // Delete the session
    storage.deleteChatSession(sessionId);
    const remainingSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(remainingSessions);

    // If deleting the current session
    if (sessionId === currentSessionId) {
      // Check if there's an empty session (new chat) available
      const emptySession = remainingSessions.find(s => s.messages.length === 0);
      
      if (emptySession) {
        // Switch to the existing empty session
        setCurrentSessionId(emptySession.id);
        setMessages([]);
      } else if (remainingSessions.length > 0) {
        // Switch to the most recent session
        const recentSession = remainingSessions[remainingSessions.length - 1];
        setCurrentSessionId(recentSession.id);
        setMessages(recentSession.messages);
      } else {
        // No sessions left, create a new one
        createNewSession();
      }
    }
  };

  const handleEditTitle = (sessionId: string, currentTitle?: string) => {
    setEditingTitleId(sessionId);
    setEditingTitleValue(currentTitle || '');
  };

  const handleSaveTitle = (sessionId: string) => {
    const newTitle = editingTitleValue.trim();
    if (newTitle) {
      storage.updateChatSession(sessionId, { title: newTitle });
      setSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, title: newTitle } : s
      ));
    }
    setEditingTitleId(null);
    setEditingTitleValue('');
  };

  const handleExportTxt = () => {
    const session = sessions.find(s => s.id === currentSessionId);
    if (session && currentPersona) {
      exportToTxt(session, currentPersona.name);
      setShowExportMenu(false);
    }
  };

  const handleExportJson = () => {
    const session = sessions.find(s => s.id === currentSessionId);
    if (session) {
      exportToJson(session);
      setShowExportMenu(false);
    }
  };

  const getSessionTitle = (session: ChatSession) => {
    if (session.title) return session.title;
    return generateTitle(session.messages);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-lg"
      >
        {showMobileSidebar ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {showMobileSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
        fixed inset-y-0 left-0 z-40 md:h-screen
        transform transition-transform duration-300 ease-in-out
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.jpg"
                alt="BuddyLine Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">BuddyLine</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={createNewSession}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              New Chat
            </button>
          </div>

          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recent Chats</h3>
            <div className="space-y-1">
              {sessions.slice(-10).reverse().map(session => (
                <div
                  key={session.id}
                  className={`flex items-center group rounded-lg transition-colors ${
                    session.id === currentSessionId
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {editingTitleId === session.id ? (
                    <div className="flex-1 flex items-center gap-1 px-2 py-1 min-w-0">
                      <input
                        type="text"
                        value={editingTitleValue}
                        onChange={(e) => setEditingTitleValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveTitle(session.id);
                          if (e.key === 'Escape') setEditingTitleId(null);
                        }}
                        className="flex-1 min-w-0 px-2 py-1 text-sm border border-blue-500 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveTitle(session.id)}
                        className="flex-shrink-0 px-2 py-1 text-green-500 hover:text-green-700"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingTitleId(null)}
                        className="flex-shrink-0 px-2 py-1 text-red-500 hover:text-red-700"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSessionSelect(session.id)}
                        className={`flex-1 text-left px-3 py-2 text-sm truncate ${
                          session.id === currentSessionId
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {getSessionTitle(session)}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(session.id, session.title || getSessionTitle(session));
                        }}
                        className="px-2 py-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit title"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="px-2 py-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete chat"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {currentSessionId && messages.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Export Chat</span>
                <span>{showExportMenu ? '▲' : '▼'}</span>
              </button>
              {showExportMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={handleExportTxt}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    📄 Export as TXT
                  </button>
                  <button
                    onClick={handleExportJson}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    📋 Export as JSON
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-gray-50 dark:bg-gray-900 min-h-screen md:ml-64">
        {/* Background Image */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/background.jpg)' }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col h-full">
          {currentPersona && (
            <PersonaSelector
              personas={allPersonas}
              currentPersona={currentPersona}
              onPersonaChange={handlePersonaChange}
              onAddPersona={handleAddCustomPersona}
              onDeletePersona={handleDeleteCustomPersona}
              onUpdatePersona={handleUpdateCustomPersona}
              hasMessages={messages.length > 0}
            />
          )}

          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onRetryMessage={handleRetryMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}