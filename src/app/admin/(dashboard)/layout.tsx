'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  UtensilsCrossed,
  Settings2,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { ToastProvider } from '@/components/ui/Toast';

interface NavItem {
  label: string;
  href: string;
  icon: typeof UtensilsCrossed;
}

const navItems: NavItem[] = [
  { label: 'Cardápio', href: '/admin/cardapio', icon: UtensilsCrossed },
  { label: 'Personalizações', href: '/admin/personalizacoes', icon: Settings2 },
];

function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-light">
        <div className="flex flex-col items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-brand-primary/30 animate-pulse" />
          <p className="text-sm text-brand-primary/50">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/admin/login');
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand-primary/10 bg-brand-light transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-brand-primary/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary">
            <ChefHat className="h-5 w-5 text-brand-secondary" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-primary">PAINEL DO CHEF</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-primary/40">
              Menu Administrativo
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-brand-primary/40 hover:bg-brand-primary/5 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-primary text-brand-light shadow-sm'
                    : 'text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary'
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-brand-primary/10 px-3 py-4">
          {user && (
            <p className="mb-2 truncate px-3 text-xs text-brand-primary/40">
              {user.name}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600/70 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-brand-primary/10 bg-brand-light/95 px-4 backdrop-blur-sm lg:px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-brand-primary/50 hover:bg-brand-primary/5 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
    </header>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-brand-light">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex flex-1 flex-col">
            <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
            <main className="flex-1 p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </AdminGuard>
    </ToastProvider>
  );
}
