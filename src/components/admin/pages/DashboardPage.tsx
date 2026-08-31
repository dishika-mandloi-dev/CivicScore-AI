import { useState } from 'react';
import {
  HeartPulse,
  Map,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calendar,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Card, ScoreGauge, ProgressBar, WardStatusBadge, LineChart, DonutChart } from '../ui';
import {
  OVERALL_SCORE,
  TOTAL_WARDS,
  ACTIVE_COMPLAINTS,
  RESOLVED_COMPLAINTS,
  SCORE_BREAKDOWN,
  HEALTH_TREND,
  COMPLAINT_DONUT,
  WARDS,
  AI_INSIGHTS,
  statusFromScore,
  scoreColor,
  type AdminPage,
} from '@/lib/adminData';

type TrendRange = '1m' | '3m' | '6m';

export default function DashboardPage({ onNavigate }: { onNavigate: (p: AdminPage) => void }) {
  const [lastUpdated, setLastUpdated] = useState('31 Aug 2026, 9:00 AM');
  const [refreshing, setRefreshing] = useState(false);
  const [trendRange, setTrendRange] = useState<TrendRange>('3m');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated('31 Aug 2026, 9:01 AM');
      setRefreshing(false);
    }, 800);
  };

  const kpis = [
    { label: 'Overall Ward Health Score', value: `${OVERALL_SCORE}`, suffix: '/100', icon: HeartPulse, color: 'from-brand-500 to-brand-700', trend: statusFromScore(OVERALL_SCORE) },
    { label: 'Total Wards', value: `${TOTAL_WARDS}`, suffix: '', icon: Map, color: 'from-emerald-500 to-emerald-700', trend: 'Monitored' },
    { label: 'Active Complaints', value: `${ACTIVE_COMPLAINTS}`, suffix: '', icon: MessageSquare, color: 'from-amber-500 to-amber-700', trend: 'Needs review' },
    { label: 'Resolved Complaints', value: `${RESOLVED_COMPLAINTS}`, suffix: '', icon: CheckCircle2, color: 'from-teal-500 to-teal-700', trend: 'On track' },
  ];

  const previewInsights = AI_INSIGHTS.slice(0, 3);
  const insightStyles: Record<string, { bg: string; border: string; iconColor: string }> = {
    Critical: { bg: 'bg-rose-50', border: 'border-rose-200', iconColor: 'text-rose-500' },
    High: { bg: 'bg-orange-50', border: 'border-orange-200', iconColor: 'text-orange-500' },
    Medium: { bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500' },
    Low: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconColor: 'text-emerald-500' },
  };

  const criticalAlerts = AI_INSIGHTS.filter((i) => i.severity === 'Critical' || i.severity === 'High').slice(0, 4);
  const topWards = WARDS.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Indore Smart Ward Health Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor ward performance and make data-driven decisions with AI-powered civic insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>31 August 2026</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400">Last updated: {lastUpdated}</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.color} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-400">{kpi.trend}</span>
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-900">
                {kpi.value}
                {kpi.suffix && <span className="text-lg font-semibold text-gray-400">{kpi.suffix}</span>}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">{kpi.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Health Score + AI Insights Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold text-gray-900">Smart Ward Health Score</h3>
          <p className="mt-1 text-sm text-gray-500">Overall Indore Municipal Performance</p>

          <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
            <div className="flex flex-shrink-0 flex-col items-center">
              <ScoreGauge score={OVERALL_SCORE} size={148} />
              <span className="mt-2 text-sm font-semibold text-gray-700">
                Status: <span className={scoreColor(OVERALL_SCORE)}>{statusFromScore(OVERALL_SCORE)}</span>
              </span>
            </div>
            <div className="flex-1 space-y-4">
              {SCORE_BREAKDOWN.map((s) => (
                <ProgressBar
                  key={s.label}
                  label={s.label}
                  sublabel={`Weight ${Math.round(s.weight * 100)}%`}
                  value={s.value}
                  color={s.color}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-emerald-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="font-display text-lg font-bold text-gray-900">AI-Powered Insights</h3>
          </div>
          <div className="space-y-3">
            {previewInsights.map((insight) => {
              const style = insightStyles[insight.severity];
              return (
                <div key={insight.id} className={`rounded-xl border ${style.border} ${style.bg} p-3`}>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${style.iconColor}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{insight.ward} — {insight.issue}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{insight.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => onNavigate('ai-insights')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
          >
            View All Insights
            <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      </div>

      {/* Trend chart + Complaints donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900">Health Score Trend</h3>
              <p className="mt-1 text-sm text-gray-500">City-wide health score over time</p>
            </div>
            <div className="flex gap-1.5">
              {([
                { id: '1m', label: 'Last Month' },
                { id: '3m', label: 'Last 3 Months' },
                { id: '6m', label: 'Last 6 Months' },
              ] as { id: TrendRange; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTrendRange(opt.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    trendRange === opt.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <LineChart data={HEALTH_TREND[trendRange]} height={240} />
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-bold text-gray-900">Complaints Overview</h3>
          <p className="mt-1 text-sm text-gray-500">Status distribution</p>
          <div className="mt-6">
            <DonutChart data={COMPLAINT_DONUT} size={150} />
          </div>
        </Card>
      </div>

      {/* Ward Performance table + Critical Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900">Ward Performance</h3>
              <p className="mt-1 text-sm text-gray-500">Click a ward to view detailed monitoring</p>
            </div>
            <button
              onClick={() => onNavigate('wards')}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Ward</th>
                  <th className="px-4 py-3">Health Score</th>
                  <th className="px-4 py-3">Cleanliness</th>
                  <th className="px-4 py-3">Infrastructure</th>
                  <th className="px-4 py-3">Water Supply</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topWards.map((w) => (
                  <tr
                    key={w.id}
                    onClick={() => onNavigate('wards')}
                    className="cursor-pointer transition-colors hover:bg-brand-50/50"
                  >
                    <td className="whitespace-nowrap px-6 py-3 font-semibold text-gray-900">
                      {String(w.wardNumber).padStart(2, '0')} — {w.wardName}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${scoreColor(w.healthScore)}`}>{w.healthScore}</td>
                    <td className="px-4 py-3 text-gray-700">{w.cleanliness}</td>
                    <td className="px-4 py-3 text-gray-700">{w.infrastructure}</td>
                    <td className="px-4 py-3 text-gray-700">{w.waterSupply}</td>
                    <td className="px-4 py-3"><WardStatusBadge status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-gray-900">Critical Alerts</h3>
            <button
              onClick={() => onNavigate('notifications')}
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => {
              const style = insightStyles[alert.severity];
              return (
                <div key={alert.id} className={`rounded-xl border ${style.border} ${style.bg} p-3`}>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${style.iconColor}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{alert.ward}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{alert.issue}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <p className="text-center text-xs text-gray-400">
        Demo data — structured for future backend / AI integration. Not official IMC data.
      </p>
    </div>
  );
}
