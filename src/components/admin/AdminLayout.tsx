import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  Map,
  HeartPulse,
  Sparkles,
  Bell,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
} from 'lucide-react';
import { type AdminPage } from '@/lib/adminData';

export type { AdminPage };

interface NavItem {
  id: AdminPage;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'complaints', label: 'Complaints', icon: MessageSquare },
  { id: 'wards', label: 'Ward Monitoring', icon: Map },
  { id: 'health-score', label: 'AI Health Score', icon: HeartPulse },
  { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  { id: 'map', label: 'Map & Wards', icon: Map },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'survey-responses', label: 'Survey Responses', icon: ClipboardList },
];

export default function AdminLayout({
  active,
  onNavigate,
  unreadCount,
  children,
  onLogout,
}: {
  active: AdminPage;
  onNavigate: (page: AdminPage) => void;
  unreadCount: number;
  children: ReactNode;
  onLogout: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleNav = (id: AdminPage) => {
    onNavigate(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={`flex items-center gap-3 border-b border-white/10 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}>
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-md">
          <Building2 className="h-5 w-5" />
        </span>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold tracking-tight text-white">CivicScore AI</span>
            <span className="text-[11px] font-medium text-slate-300">Indore Municipal Corporation</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const showBadge = item.id === 'notifications' && unreadCount > 0;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {showBadge && (
                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white ${collapsed ? 'absolute -right-0.5 -top-0.5' : ''}`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile */}
      <div className="border-t border-white/10 px-3 py-4">
        <div className={`flex items-center gap-3 rounded-lg px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-bold text-white">
            A
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="truncate text-sm font-semibold text-white">Administrator</span>
              <span className="truncate text-xs text-slate-300">admin@imc.gov.in</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-rose-500/20 hover:text-rose-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden bg-ink-900 transition-all duration-300 lg:block ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-brand-600"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink-900/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-ink-900 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-emerald-600 text-white">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-bold text-gray-900">CivicScore AI</span>
          </div>
          <div className="w-10" />
        </div>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
