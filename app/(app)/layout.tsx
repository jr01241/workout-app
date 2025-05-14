export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <nav className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">AI Strength Coach</h1>
          </div>
        </nav>
      </header>
      {children}
    </div>
  )
}
