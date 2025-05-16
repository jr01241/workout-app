'use client';
import { Message } from 'ai/react';
import { ChatMessageItem } from './ChatMessageItem';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useEffect, useRef } from 'react';

interface ChatMessagesListProps {
  messages: Message[];
}

export function ChatMessagesList({ messages }: ChatMessagesListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-grow p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} />
        ))}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
