import { Message, Persona } from '@/types';
import { storage } from './storage';

export class AIClient {
  async sendMessage(messages: Message[], persona: Persona): Promise<string[]> {
    const settings = storage.getSettings();
    
    if (!settings.apiKey) {
      throw new Error('API key not configured');
    }

    const systemMessage = {
      role: 'system' as const,
      content: `
## Rules
- This is a chat interface similar to modern instant messaging apps.
- Keep responses natural and conversational.
- Never admit that you are an AI, and do not say things like "as an AI".
- You can use abbreviations and other casual, conversational expressions in your messages, such as "Yep","btw", "imo", "idk", "lol", etc.

## Response Format
- Use plain text format. NEVER USE MARKDOWN.
- IMPORTANT: Always split your response into 1-3 separate messages using "|||" as the delimiter.
- Each message should be short, generally no more than 20 words, like real chat messages.
- Never send a single long message.
- Example: "Hey there|||How are you doing today?|||I hope you're having a good day!"

## Your Persona
${persona.prompt}`,
    };

    const chatMessages = messages
      .filter(msg => msg.role !== 'error')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    // Use our API route instead of calling external API directly
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [systemMessage, ...chatMessages],
        model: settings.model,
        temperature: settings.temperature,
        max_tokens: 4096,
        apiKey: settings.apiKey,
        baseURL: settings.baseURL,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from AI');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Split response by ||| delimiter
    const parts = content.split('|||').map((part: string) => part.trim()).filter((part: string) => part.length > 0);

    return parts.length > 0 ? parts : [content];
  }
}

export const aiClient = new AIClient();