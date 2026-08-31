import { ArrowLeft, MapPin, User, Calendar, Droplets, Sparkles, HardHat, Briefcase, AlertTriangle } from 'lucide-react';
import { Card, ScoreGauge, ProgressBar, WardStatusBadge, ComplaintStatusBadge, PriorityBadge, EmptyState } from '../ui';
import {
  getWardById,
  wardComplaintStats,
  complaintsByWard,
  wardInsight,
  SCORE_WEIGHTS,
  type AdminPage,
} from '@/lib/adminData';

export default function WardDetailPage({
  wardId,
  onBack,
  onNavigate,
}: {
  wardId: number;
  onBack: () => void;
  onNavigate: (p: AdminPage) => void;
}) {
  const ward = getWardById(wardId);

  if (!ward) {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <ArrowLeft className="h-4 w-4" /> Back to Wards
        </button>
        <Card className="p-6">
          <EmptyState title="Ward not found" subtitle="The selected ward could not be loaded." />
        </Card>
      </div>
    );
  }

  const stats = wardComplaintStats(wardId);
  const recentComplaints = complaintsByWard(wardId).slice(0, 5);
  const insight = wardInsight(wardId);

  const params = [
    { key: 'cleanliness' as const, label: 'Cleanliness', value: ward.cleanliness, weight: SCORE_WEIGHTS.cleanliness, color: 'bg-emerald-500' },
    { key: 'complaints' as const, label: 'Complaints', value: 78, weight: SCORE_WEIGHTS.complaints, color: 'bg-amber-500' },
    { key: 'infrastructure' as const, label: 'Infrastructure', value: ward.infrastructure, weight: SCORE_WEIGHTS.infrastructure, color: 'bg-brand-500' },
    { key: 'waterSupply' as const, label: 'Water Supply', value: ward.waterSupply, weight: SCORE_WEIGHTS.waterSupply, color: 'bg-cyan-500' },
    { key: 'publicServices' as const, label: 'Public Services', value: ward.publicServices, weight: SCORE_WEIGHTS.publicServices, color: 'bg-violet-500' },
  ];

  const infraItems = [
    { label: 'Roads', value: Math.min(100, ward.infrastructure + 4) },
    { label: 'Street Lights', value: Math.min(100, ward.infrastructure + 8) },
    { label: 'Public Infrastructure', value: ward.infrastructure },
    { label: 'Drainage', value: Math.max(20, ward.infrastructure - 10) },
  ];

  const waterComplaints = Math.round(ward.complaints * 0.18);
  const cleanComplaints = Math.round(ward.complaints * 0.22);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button onClick={onBack} className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" /> Back to Wards
          </button>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Ward {String(ward.wardNumber).padStart(2, '0')} — {ward.wardName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Detailed monitoring for {ward.wardName}, {ward.city}</p>
        </div>
        <WardStatusBadge status={ward.status} />
      </div>

      {/* Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="flex flex-col items-center justify-center">
            <ScoreGauge score={ward.healthScore} size={132} />
            <span className="mt-2 text-sm font-semibold text-gray-700">Health Score</span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-3">
            <InfoTile icon={MapPin} label="Zone" value={ward.zone} />
            <InfoTile icon={User} label="Ward Officer" value={ward.officer} />
            <InfoTile icon={Calendar} label="Last Updated" value={ward.lastUpdated} />
            <InfoTile icon={MapPin} label="Municipal Corp." value="IMC" />
            <InfoTile icon={MapPin} label="City" value={ward.city} />
            <InfoTile icon={MapPin} label="Ward No." value={String(ward.wardNumber).padStart(2, '0')} />
          </div>
        </div>
      </Card>

      {/* Complaints + Health Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Complaints */}
        <Card className="p-6">
          <h3 className="font-display text-lg font-bold text-gray-900">Complaints</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MiniStat label="Total" value={stats.total} color="text-gray-900" />
            <MiniStat label="Pending" value={stats.pending} color="text-amber-600" />
            <MiniStat label="In Progress" value={stats.inProgress} color="text-brand-600" />
            <MiniStat label="Resolved" value={stats.resolved} color="text-emerald-600" />
            <MiniStat label="Critical" value={stats.critical} color="text-rose-600" />
          </div>
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Recent Complaints</h4>
            {recentComplaints.length > 0 ? (
              <div className="space-y-2">
                {recentComplaints.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{c.id} — {c.category}</p>
                      <p className="truncate text-xs text-gray-500">{c.description}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <PriorityBadge priority={c.priority} />
                      <ComplaintStatusBadge status={c.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No recent complaints" />
            )}
          </div>
        </Card>

        {/* Health Score Breakdown */}
        <Card className="p-6">
          <h3 className="font-display text-lg font-bold text-gray-900">Health Score Breakdown</h3>
          <p className="mt-1 text-sm text-gray-500">Weighted contribution to total score</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-2">Parameter</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Weight</th>
                  <th className="py-2">Weighted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {params.map((p) => (
                  <tr key={p.key}>
                    <td className="py-2.5 font-medium text-gray-700">{p.label}</td>
                    <td className="py-2.5 text-gray-700">{p.value}</td>
                    <td className="py-2.5 text-gray-500">{Math.round(p.weight * 100)}%</td>
                    <td className="py-2.5 font-semibold text-gray-900">{(p.value * p.weight).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td className="py-2.5 font-bold text-gray-900" colSpan={3}>Total Health Score</td>
                  <td className="py-2.5 font-bold text-brand-600">{ward.healthScore}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>

      {/* Infrastructure + Water + Cleanliness */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <HardHat className="h-5 w-5 text-brand-600" />
            <h3 className="font-display text-lg font-bold text-gray-900">Infrastructure</h3>
          </div>
          <div className="space-y-4">
            {infraItems.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} color={item.value >= 75 ? 'bg-emerald-500' : item.value >= 55 ? 'bg-amber-500' : 'bg-rose-500'} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-cyan-600" />
            <h3 className="font-display text-lg font-bold text-gray-900">Water Supply</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Water Supply Score</span>
              <span className="font-semibold text-gray-900">{ward.waterSupply}/100</span>
            </div>
            <ProgressBar value={ward.waterSupply} color={ward.waterSupply >= 75 ? 'bg-emerald-500' : ward.waterSupply >= 55 ? 'bg-amber-500' : 'bg-rose-500'} showValue={false} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Supply Status</span>
              <span className="font-medium text-gray-900">{ward.waterSupply >= 75 ? 'Stable' : ward.waterSupply >= 55 ? 'Irregular' : 'Poor'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Water Complaints</span>
              <span className="font-medium text-gray-900">{waterComplaints}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trend</span>
              <span className={`font-medium ${ward.waterSupply >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {ward.waterSupply >= 70 ? 'Stable' : 'Declining'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="font-display text-lg font-bold text-gray-900">Cleanliness</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cleanliness Score</span>
              <span className="font-semibold text-gray-900">{ward.cleanliness}/100</span>
            </div>
            <ProgressBar value={ward.cleanliness} color={ward.cleanliness >= 75 ? 'bg-emerald-500' : ward.cleanliness >= 55 ? 'bg-amber-500' : 'bg-rose-500'} showValue={false} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-gray-900">{ward.cleanliness >= 75 ? 'Clean' : ward.cleanliness >= 55 ? 'Moderate' : 'Poor'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Cleanliness Complaints</span>
              <span className="font-medium text-gray-900">{cleanComplaints}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trend</span>
              <span className={`font-medium ${ward.cleanliness >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {ward.cleanliness >= 70 ? 'Improving' : 'Needs attention'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Ward-specific AI insight */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className={`h-5 w-5 ${
            insight.severity === 'Critical' ? 'text-rose-500' : insight.severity === 'High' ? 'text-orange-500' : insight.severity === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
          }`} />
          <h3 className="font-display text-lg font-bold text-gray-900">Ward-Specific AI Insight</h3>
        </div>
        <div className={`rounded-xl border p-4 ${
          insight.severity === 'Critical' ? 'border-rose-200 bg-rose-50' : insight.severity === 'High' ? 'border-orange-200 bg-orange-50' : insight.severity === 'Medium' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'
        }`}>
          <p className="text-sm font-semibold text-gray-900">{insight.issue}</p>
          <p className="mt-1 text-sm text-gray-600">{insight.explanation}</p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            <span className="text-gray-500">Recommended action: </span>{insight.recommendedAction}
          </p>
        </div>
        <button
          onClick={() => onNavigate('ai-insights')}
          className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View all AI insights →
        </button>
      </Card>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
    </div>
  );
}
