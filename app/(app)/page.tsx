import { ChatInterface } from '../../components/chat/ChatInterface';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Chat with AI Coach</h2>
      <ChatInterface />
    </div>
  );
}
