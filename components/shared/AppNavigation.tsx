'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppNavigation() {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">AI Strength Coach</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md ${
                !isDashboard ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </Link>
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-md ${
                isDashboard ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
