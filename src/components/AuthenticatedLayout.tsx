'use client';

import Sidebar from './Sidebar';
import ProtectedRoute from './ProtectedRoute';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
