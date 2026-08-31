import { useState } from 'react';
import { Bell, CheckCheck, MapPin, MessageSquare, ChevronRight } from 'lucide-react';
import { Card, EmptyState } from '../ui';
import {
  INITIAL_NOTIFICATIONS,
  type AdminNotification,
  type AdminPage,
} from '@/lib/adminData';

type FilterTab = 'All' | 'Unread' | 'Read';

const severityStyles: Record<string, string> = {
  Critical: 'bg-rose-100 text-rose-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-slate-100 text-slate-600',
};

const typeIcons: Record<string, typeof Bell> = {
  'Health Score Alert': Bell,
  'Critical Ward': MapPin,
  'Complaint Escalation': MessageSquare,
  'Infrastructure': MapPin,
  'Water Supply': MapPin,
  'Cleanliness': MapPin,
  'AI Insight': Bell,
};

export default function NotificationsPage({ onNavigate }: { onNavigate: (p: AdminPage) => void }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [tab, setTab] = useState<FilterTab>('All');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (tab === 'Unread') return !n.read;
    if (tab === 'Read') return n.read;
    return true;
  });

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">Important alerts and notifications.</p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <CheckCheck className="h-4 w-4" />
          Mark All as Read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['All', 'Unread', 'Read'] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-gray-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {t}
            {t === 'Unread' && unreadCount > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t ? 'bg-white/20' : 'bg-rose-100 text-rose-600'}`}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <Card key={n.id} className={`p-4 transition-colors ${n.read ? 'opacity-70' : 'ring-1 ring-brand-200'}`}>
              <div className="flex items-start gap-3">
                <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${n.read ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">{n.type}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${severityStyles[n.severity]}`}>
                      {n.severity}
                    </span>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">{n.message}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                    <span>{n.ward}</span>
                    <span>•</span>
                    <span>{n.dateTime}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                      >
                        Mark as Read
                      </button>
                    )}
                    {n.wardId > 0 && (
                      <button
                        onClick={() => onNavigate('wards')}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                      >
                        View Ward
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('complaints')}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-slate-50"
                    >
                      View Complaint
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-6">
          <EmptyState title="No notifications" subtitle="You're all caught up." />
        </Card>
      )}
    </div>
  );
}
