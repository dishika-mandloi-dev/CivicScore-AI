import { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Card, WardStatusBadge, EmptyState } from '../ui';
import { WARDS, type WardStatus, type AdminPage } from '@/lib/adminData';

export default function WardsPage({ onNavigate, onSelectWard }: { onNavigate: (p: AdminPage) => void; onSelectWard: (id: number) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<WardStatus | 'All'>('All');

  const filtered = useMemo(() => {
    return WARDS.filter((w) => {
      const matchSearch =
        w.wardName.toLowerCase().includes(search.toLowerCase()) ||
        String(w.wardNumber).includes(search);
      const matchStatus = statusFilter === 'All' || w.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const statuses: (WardStatus | 'All')[] = ['All', 'Excellent', 'Good', 'Needs Attention', 'Critical'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Ward Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">
          Indore Municipal Corporation — {WARDS.length} wards. Click a ward to view detailed monitoring.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ward number or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-400/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  statusFilter === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Ward No.</th>
                <th className="px-4 py-3">Ward Name</th>
                <th className="px-4 py-3">Health Score</th>
                <th className="px-4 py-3">Cleanliness</th>
                <th className="px-4 py-3">Infrastructure</th>
                <th className="px-4 py-3">Water Supply</th>
                <th className="px-4 py-3">Complaints</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((w) => (
                <tr
                  key={w.id}
                  onClick={() => onSelectWard(w.id)}
                  className="cursor-pointer transition-colors hover:bg-brand-50/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{String(w.wardNumber).padStart(2, '0')}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{w.wardName}</td>
                  <td className="px-4 py-3 font-semibold text-brand-600">{w.healthScore}</td>
                  <td className="px-4 py-3 text-gray-700">{w.cleanliness}</td>
                  <td className="px-4 py-3 text-gray-700">{w.infrastructure}</td>
                  <td className="px-4 py-3 text-gray-700">{w.waterSupply}</td>
                  <td className="px-4 py-3 text-gray-700">{w.complaints}</td>
                  <td className="px-4 py-3"><WardStatusBadge status={w.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{w.lastUpdated}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center text-brand-600">
                      View <ChevronRight className="h-4 w-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState title="No wards match your search" subtitle="Try a different ward name or number." />}
        <div className="border-t border-slate-200 px-4 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {WARDS.length} wards
        </div>
      </Card>

      <p className="text-center text-xs text-gray-400">
        Demo ward data — Indore context, ready for verified IMC dataset integration.
      </p>
    </div>
  );
}
