'use client';
import { FormEvent } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface ChatInputAreaProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInputArea({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputAreaProps) {
  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Send a message..."
        disabled={isLoading}
        className="flex-grow"
      />
      <Button type="submit" disabled={isLoading || !input.trim()}>
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}
