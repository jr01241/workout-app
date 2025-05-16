'use client';
import { Message } from 'ai/react';

interface ChatMessageItemProps {
  message: Message;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${isUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
          }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
