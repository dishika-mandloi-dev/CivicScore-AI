import { useState, useMemo } from 'react';
import { Search, X, MessageSquare, Clock, Loader, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, ComplaintStatusBadge, PriorityBadge, EmptyState } from '../ui';
import {
  COMPLAINTS,
  TOTAL_COMPLAINTS,
  ACTIVE_COMPLAINTS,
  PENDING_COMPLAINTS,
  INPROGRESS_COMPLAINTS,
  RESOLVED_COMPLAINTS,
  CRITICAL_COMPLAINTS,
  COMPLAINT_CATEGORIES,
  WARDS,
  type ComplaintStatus,
  type Priority,
  type Complaint,
} from '@/lib/adminData';

export default function ComplaintsPage() {
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [selected, setSelected] = useState<Complaint | null>(null);

  const filtered = useMemo(() => {
    return COMPLAINTS.filter((c) => {
      const matchSearch =
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.ward.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchWard = wardFilter === 'All' || c.wardId === Number(wardFilter);
      const matchCat = categoryFilter === 'All' || c.category === categoryFilter;
      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchWard && matchCat && matchPriority && matchStatus;
    });
  }, [search, wardFilter, categoryFilter, priorityFilter, statusFilter]);

  const reset = () => {
    setSearch('');
    setWardFilter('All');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setStatusFilter('All');
  };

  const stats = [
    { label: 'Total Complaints', value: TOTAL_COMPLAINTS.toLocaleString(), icon: MessageSquare, color: 'bg-brand-500' },
    { label: 'Active', value: ACTIVE_COMPLAINTS, icon: Clock, color: 'bg-amber-500' },
    { label: 'Pending', value: PENDING_COMPLAINTS, icon: Clock, color: 'bg-amber-500' },
    { label: 'Resolved', value: RESOLVED_COMPLAINTS, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Critical', value: CRITICAL_COMPLAINTS, icon: AlertTriangle, color: 'bg-rose-500' },
  ];

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Complaints Management</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor and manage civic complaints across Indore wards.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${s.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, ward, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-400/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)} className={selectClass}>
              <option value="All">All Wards</option>
              {WARDS.map((w) => (
                <option key={w.id} value={w.id}>{String(w.wardNumber).padStart(2, '0')} — {w.wardName}</option>
              ))}
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectClass}>
              <option value="All">All Categories</option>
              {COMPLAINT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')} className={selectClass}>
              <option value="All">All Priorities</option>
              {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'All')} className={selectClass}>
              <option value="All">All Statuses</option>
              {(['Pending', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={reset}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Complaint ID</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{c.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{c.ward}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{c.category}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{c.date}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-4 py-3"><ComplaintStatusBadge status={c.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{c.department}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(c)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState title="No complaints match your filters" subtitle="Try adjusting or resetting the filters." />}
        <div className="border-t border-slate-200 px-4 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {COMPLAINTS.length} complaints
        </div>
      </Card>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setSelected(null)} />
          <Card className="relative z-10 w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-gray-900">Complaint Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <DetailRow label="Complaint ID" value={selected.id} />
              <DetailRow label="Ward" value={`${selected.ward} (Ward ${selected.wardId})`} />
              <DetailRow label="Category" value={selected.category} />
              <DetailRow label="Description" value={selected.description} />
              <DetailRow label="Priority" value={selected.priority} />
              <DetailRow label="Status" value={selected.status} />
              <DetailRow label="Department" value={selected.department} />
              <DetailRow label="Created Date" value={selected.createdDate} />
              <DetailRow label="Updated Date" value={selected.updatedDate} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-slate-100 pb-2">
      <span className="w-32 flex-shrink-0 text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
