import { useState } from 'react';
import { MapPin, X, ArrowRight, Search } from 'lucide-react';
import { Card, WardStatusBadge, EmptyState } from '../ui';
import { WARDS, statusAccent, type Ward, type AdminPage } from '@/lib/adminData';

export default function MapWardsPage({ onNavigate }: { onNavigate: (p: AdminPage) => void }) {
  const [selected, setSelected] = useState<Ward | null>(null);
  const [search, setSearch] = useState('');

  const filtered = WARDS.filter((w) =>
    w.wardName.toLowerCase().includes(search.toLowerCase()) || String(w.wardNumber).includes(search)
  );

  // Indore approximate center
  const centerLat = 22.72;
  const centerLng = 75.86;
  const latRange = 0.06;
  const lngRange = 0.06;

  const toX = (lng: number) => ((lng - (centerLng - lngRange)) / (lngRange * 2)) * 100;
  const toY = (lat: number) => (1 - (lat - (centerLat - latRange)) / (latRange * 2)) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Indore Ward Map</h1>
        <p className="mt-1 text-sm text-gray-500">Interactive map showing ward health status across Indore.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map */}
        <Card className="overflow-hidden lg:col-span-2">
          <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            {/* Indore label */}
            <div className="absolute left-1/2 top-3 -translate-x-1/2 text-xs font-semibold text-slate-400">
              Indore Municipal Corporation
            </div>

            {/* Ward markers */}
            {filtered.map((w) => {
              const a = statusAccent(w.status);
              return (
                <button
                  key={w.id}
                  onClick={() => setSelected(w)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-all hover:scale-125 ${a.dot} ${
                    selected?.id === w.id ? 'h-5 w-5 ring-2 ring-brand-400 ring-offset-2' : 'h-3.5 w-3.5'
                  }`}
                  style={{ left: `${toX(w.coordinates.lng)}%`, top: `${toY(w.coordinates.lat)}%` }}
                  title={`${w.wardName} — ${w.healthScore}`}
                />
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 backdrop-blur">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Status</p>
              <div className="flex flex-wrap gap-2">
                {(['Excellent', 'Good', 'Needs Attention', 'Critical'] as const).map((s) => {
                  const a = statusAccent(s);
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} />
                      <span className="text-xs text-gray-600">{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {filtered.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <EmptyState title="No wards match your search" />
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 p-4">
            <p className="text-xs text-gray-400">
              Integration-ready map placeholder — connect Google Maps API key to enable live Indore ward boundaries. Ward positions are approximate demo coordinates.
            </p>
          </div>
        </Card>

        {/* Sidebar: search + ward list */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ward..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-400/20"
              />
            </div>
          </Card>

          {selected ? (
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-gray-900">Ward Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Ward {String(selected.wardNumber).padStart(2, '0')} — {selected.wardName}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Health Score</span>
                  <span className="font-bold text-brand-600">{selected.healthScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <WardStatusBadge status={selected.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Cleanliness</span>
                  <span className="font-medium text-gray-900">{selected.cleanliness}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Infrastructure</span>
                  <span className="font-medium text-gray-900">{selected.infrastructure}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Water Supply</span>
                  <span className="font-medium text-gray-900">{selected.waterSupply}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Active Complaints</span>
                  <span className="font-medium text-gray-900">{selected.complaints}</span>
                </div>
                <button
                  onClick={() => onNavigate('wards')}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  View Ward Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ) : (
            <Card className="p-5">
              <p className="text-sm text-gray-500">Click a ward marker on the map to view its details here.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
