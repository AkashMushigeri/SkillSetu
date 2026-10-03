export function upsertSpokenCaption<T extends { sender: 'ai' | 'user'; text: string }>(messages: T[], caption: T): T[] {
  const last = messages[messages.length - 1];
  if (last?.sender !== caption.sender) return [...messages, caption];
  if (last.text === caption.text) return messages;
  return [...messages.slice(0, -1), { ...last, text: caption.text }];
}
