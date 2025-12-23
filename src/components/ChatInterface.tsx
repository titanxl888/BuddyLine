'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { groupMessagesByDate } from '@/utils/helpers';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onRetryMessage?: (messageId: string) => void;
  isLoading: boolean;
}

export default function ChatInterface({ messages, onSendMessage, onRetryMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:px-8 lg:px-16 xl:px-32 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p>Start a conversation with your companion</p>
            </div>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              {/* Date separator */}
              <div className="flex items-center justify-center">
                <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  {group.date}
                </div>
              </div>
              
              {/* Messages in this date group */}
              {group.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' || message.role === 'error' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.role === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-gray-800 dark:text-gray-200'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <p className="text-sm flex-1">{message.content}</p>
                      {message.role === 'error' && (
                        <div className="flex items-center space-x-1">
                          <div
                            className="text-red-500 cursor-help"
                            title={message.errorMessage || 'Unknown error'}
                          >
                            ⚠️
                          </div>
                          {onRetryMessage && (
                            <button
                              onClick={() => onRetryMessage(message.id)}
                              className="text-blue-500 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Retry"
                            >
                              ↻
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' :
                      message.role === 'error' ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 md:p-4 md:px-8 lg:px-16 xl:px-32 safe-area-bottom">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 md:px-6 py-2 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}