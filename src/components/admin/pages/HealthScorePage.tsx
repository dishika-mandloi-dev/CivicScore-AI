import { useState } from 'react';
import { ArrowRight, Database, Filter, Brain, Calculator, TrendingUp, LayoutDashboard } from 'lucide-react';
import { Card, ScoreGauge, ProgressBar } from '../ui';
import {
  OVERALL_SCORE,
  WARDS,
  SCORE_WEIGHTS,
  WEIGHT_LABELS,
  AI_PROCESS_STEPS,
  statusFromScore,
  scoreColor,
} from '@/lib/adminData';

export default function HealthScorePage() {
  const [selectedId, setSelectedId] = useState(1);
  const ward = WARDS.find((w) => w.id === selectedId)!;

  const processIcons = [Database, Filter, Brain, Calculator, TrendingUp, LayoutDashboard];

  const overallParams = WEIGHT_LABELS.map((w) => {
    const value =
      w.key === 'cleanliness' ? Math.round(WARDS.reduce((s, x) => s + x.cleanliness, 0) / WARDS.length) :
      w.key === 'infrastructure' ? Math.round(WARDS.reduce((s, x) => s + x.infrastructure, 0) / WARDS.length) :
      w.key === 'waterSupply' ? Math.round(WARDS.reduce((s, x) => s + x.waterSupply, 0) / WARDS.length) :
      w.key === 'publicServices' ? Math.round(WARDS.reduce((s, x) => s + x.publicServices, 0) / WARDS.length) :
      78;
    return { ...w, value, weighted: value * w.weight };
  });

  const wardParams = WEIGHT_LABELS.map((w) => {
    const value =
      w.key === 'cleanliness' ? ward.cleanliness :
      w.key === 'infrastructure' ? ward.infrastructure :
      w.key === 'waterSupply' ? ward.waterSupply :
      w.key === 'publicServices' ? ward.publicServices :
      78;
    return { ...w, value, weighted: value * w.weight };
  });

  const wardTotal = wardParams.reduce((s, p) => s + p.weighted, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">AI Health Score</h1>
        <p className="mt-1 text-sm text-gray-500">AI-powered health score calculation for Indore wards.</p>
      </div>

      {/* Process flow */}
      <Card className="p-6">
        <h3 className="mb-5 font-display text-lg font-bold text-gray-900">AI Score Calculation Process</h3>
        <div className="flex flex-wrap items-center gap-2">
          {AI_PROCESS_STEPS.map((step, i) => {
            const Icon = processIcons[i];
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center" style={{ minWidth: 130 }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{step.label}</p>
                    <p className="mt-0.5 text-[10px] leading-tight text-gray-400">{step.desc}</p>
                  </div>
                </div>
                {i < AI_PROCESS_STEPS.length - 1 && <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300" />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Overall score */}
      <Card className="p-6">
        <h3 className="font-display text-lg font-bold text-gray-900">Overall Indore Health Score</h3>
        <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
          <div className="flex flex-shrink-0 flex-col items-center">
            <ScoreGauge score={OVERALL_SCORE} size={140} />
            <span className="mt-2 text-sm font-semibold text-gray-700">
              Status: <span className={scoreColor(OVERALL_SCORE)}>{statusFromScore(OVERALL_SCORE)}</span>
            </span>
          </div>
          <div className="flex-1 space-y-4">
            {overallParams.map((p) => (
              <ProgressBar key={p.label} label={p.label} sublabel={`Weight ${Math.round(p.weight * 100)}%`} value={p.value} color="bg-brand-500" />
            ))}
          </div>
        </div>
      </Card>

      {/* Ward-wise scores */}
      <Card className="overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="font-display text-lg font-bold text-gray-900">Ward-wise Health Scores</h3>
          <p className="mt-1 text-sm text-gray-500">Select a ward to view its parameter breakdown</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Ward</th>
                <th className="px-4 py-3">Health Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WARDS.slice(0, 12).map((w) => (
                <tr key={w.id} className={selectedId === w.id ? 'bg-brand-50' : 'hover:bg-slate-50'}>
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{String(w.wardNumber).padStart(2, '0')} — {w.wardName}</td>
                  <td className={`px-4 py-3 font-semibold ${scoreColor(w.healthScore)}`}>{w.healthScore}</td>
                  <td className="px-4 py-3 text-gray-600">{w.status}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedId(w.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        selectedId === w.id ? 'bg-brand-600 text-white' : 'border border-slate-200 text-brand-600 hover:bg-brand-50'
                      }`}
                    >
                      {selectedId === w.id ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Selected ward calculation */}
      <Card className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gray-900">
              {String(ward.wardNumber).padStart(2, '0')} — {ward.wardName} — Weighted Calculation
            </h3>
            <p className="mt-1 text-sm text-gray-500">Formula: Health Score = Σ (Weight × Parameter)</p>
          </div>
          <div className="flex flex-col items-center">
            <ScoreGauge score={ward.healthScore} size={104} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="py-2">Parameter</th>
                <th className="py-2">Score</th>
                <th className="py-2">Weight</th>
                <th className="py-2">Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wardParams.map((p) => (
                <tr key={p.key}>
                  <td className="py-3 font-medium text-gray-700">{p.label}</td>
                  <td className="py-3 text-gray-700">{p.value}</td>
                  <td className="py-3 text-gray-500">{Math.round(p.weight * 100)}%</td>
                  <td className="py-3 font-semibold text-gray-900">{p.weighted.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200">
                <td className="py-3 font-bold text-gray-900" colSpan={3}>Total Health Score</td>
                <td className="py-3 font-bold text-brand-600">{Math.round(wardTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Demo calculation — structured for future AI engine integration. Risk predictions are not shown when historical data is insufficient.
        </p>
      </Card>
    </div>
  );
}
