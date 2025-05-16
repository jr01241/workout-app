import { AppNavigation } from '@/components/shared/AppNavigation';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AppNavigation />
      <main className="flex-grow container mx-auto px-4 py-4 sm:py-8">
        <div className="mt-4 sm:mt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
