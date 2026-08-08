'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminProfileProvider } from '@/contexts/AdminProfileContext';
import { useAdminIdleTimeout } from '@/lib/useAdminIdleTimeout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAdminIdleTimeout();

  return (
    <AdminProfileProvider>
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 bg-background overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-background border-b px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-sm">LTIC SARL Admin</span>
        </div>
        {children}
      </main>
    </div>
    </AdminProfileProvider>
  );
}
