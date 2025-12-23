import { ChatSession, Message } from '@/types';

// Export chat session to TXT format
export function exportToTxt(session: ChatSession, personaName: string): void {
  const title = session.title || 'Untitled Chat';
  const date = new Date(session.createdAt).toLocaleString();
  
  let content = `${title}\n`;
  content += `Persona: ${personaName}\n`;
  content += `Date: ${date}\n`;
  content += `${'='.repeat(50)}\n\n`;
  
  session.messages.forEach((msg) => {
    if (msg.role === 'error') return;
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const sender = msg.role === 'user' ? 'You' : personaName;
    content += `[${time}] ${sender}:\n${msg.content}\n\n`;
  });
  
  downloadFile(content, `${title}.txt`, 'text/plain');
}

// Export chat session to JSON format
export function exportToJson(session: ChatSession): void {
  const title = session.title || 'Untitled Chat';
  const jsonContent = JSON.stringify(session, null, 2);
  downloadFile(jsonContent, `${title}.json`, 'application/json');
}

// Helper function to download file
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate automatic title from first user message
export function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  
  const content = firstUserMessage.content.trim();
  if (content.length <= 30) return content;
  return content.slice(0, 30) + '...';
}

// Format date for message grouping
export function formatMessageDate(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  
  // Reset time to midnight for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
  if (messageDay.getTime() === today.getTime()) {
    return 'Today';
  } else if (messageDay.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (now.getTime() - messageDay.getTime() < 7 * 24 * 60 * 60 * 1000) {
    // Within last week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[messageDate.getDay()];
  } else {
    // Older messages - format as MM/DD
    return `${messageDate.getMonth() + 1}/${messageDate.getDate()}`;
  }
}

// Group messages by date
export function groupMessagesByDate(messages: Message[]): { date: string; messages: Message[] }[] {
  const groups: { [key: string]: Message[] } = {};
  
  messages.forEach(message => {
    const dateKey = formatMessageDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });
  
  return Object.entries(groups).map(([date, msgs]) => ({
    date,
    messages: msgs
  }));
}
