import { useState } from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, Lightbulb, ChevronRight } from 'lucide-react';
import { Card, EmptyState } from '../ui';
import { AI_INSIGHTS, type InsightCategory, type AdminPage } from '@/lib/adminData';

const CATEGORIES: { id: InsightCategory; label: string; icon: typeof AlertTriangle }[] = [
  { id: 'Critical Alerts', label: 'Critical Alerts', icon: AlertTriangle },
  { id: 'Performance Changes', label: 'Performance Changes', icon: TrendingUp },
  { id: 'Risk Predictions', label: 'Risk Predictions', icon: ShieldAlert },
  { id: 'Recommendations', label: 'Recommendations', icon: Lightbulb },
];

const severityStyles: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Critical: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
  High: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
  Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  Low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export default function AIInsightsPage({ onNavigate }: { onNavigate: (p: AdminPage) => void }) {
  const [active, setActive] = useState<InsightCategory>('Critical Alerts');

  const filtered = AI_INSIGHTS.filter((i) => i.category === active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="mt-1 text-sm text-gray-500">AI-generated insights and recommendations for better ward management.</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                active === cat.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-gray-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
              <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                active === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-gray-500'
              }`}>
                {AI_INSIGHTS.filter((i) => i.category === cat.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Insights list */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((insight) => {
          const style = severityStyles[insight.severity];
          return (
            <Card key={insight.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  <span className={`text-xs font-semibold ${style.text}`}>{insight.severity}</span>
                </div>
                <span className="text-xs text-gray-400">{insight.dateTime}</span>
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-gray-900">{insight.ward} — {insight.issue}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{insight.explanation}</p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold text-gray-500">Recommended Action</p>
                <p className="mt-1 text-sm text-gray-700">{insight.recommendedAction}</p>
              </div>
              <button
                onClick={() => onNavigate('wards')}
                className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                View Ward
                <ChevronRight className="h-4 w-4" />
              </button>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-6">
          <EmptyState title="No insights in this category" subtitle="Check back after more data is collected." />
        </Card>
      )}

      <p className="text-center text-xs text-gray-400">
        Demo insights — structured for future AI model integration. Risk predictions are shown only where sufficient historical data is assumed.
      </p>
    </div>
  );
}
