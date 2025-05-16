'use client';
import { useChat } from 'ai/react';
import { ChatInputArea } from './ChatInputArea';
import { ChatMessagesList } from './ChatMessagesList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex flex-col space-y-4">
      <Card className="flex-grow relative">
        <div className="h-[60vh] flex flex-col">
          <ChatMessagesList messages={messages} />
          <div className="p-4 border-t">
            <ChatInputArea
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Card>
      {error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          Error: {error.message || 'Something went wrong'}
        </div>
      )}
    </div>
  );
}
