import type { ReactNode } from 'react';
import {
  statusAccent,
  type WardStatus,
} from '@/lib/adminData';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  color = 'bg-brand-500',
  label,
  sublabel,
  showValue = true,
}: {
  value: number;
  color?: string;
  label?: string;
  sublabel?: string;
  showValue?: boolean;
}) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {label}
            {sublabel && <span className="ml-2 text-xs text-gray-400">{sublabel}</span>}
          </span>
          {showValue && <span className="text-sm font-semibold text-gray-900">{value}</span>}
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function WardStatusBadge({ status }: { status: WardStatus }) {
  const a = statusAccent(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${a.bg} ${a.text} ${a.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Critical: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    High: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    Medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Low: 'bg-slate-50 text-slate-600 ring-slate-600/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[priority] || styles.Low}`}>
      {priority}
    </span>
  );
}

export function ComplaintStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    'In Progress': 'bg-brand-50 text-brand-700 ring-brand-600/20',
    Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status] || 'bg-slate-50 text-slate-700 ring-slate-600/20'}`}>
      {status}
    </span>
  );
}

export function ScoreGauge({ score, size = 128 }: { score: number; size?: number }) {
  const r = size / 2 - 10;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const stroke = score >= 85 ? '#10b981' : score >= 70 ? '#0b5ed7' : score >= 55 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

export function DonutChart({ data, size = 160 }: { data: { label: string; count: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let offset = 0;
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 flex-shrink-0">
        {data.map((d, i) => {
          const dash = (d.count / total) * circumference;
          const seg = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth="20"
              className={d.color.replace('bg-', 'stroke-')}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${d.color}`} />
            <span className="text-sm text-gray-600">{d.label}</span>
            <span className="text-sm font-semibold text-gray-900">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data, height = 200, color = '#0b5ed7' }: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const w = 560;
  const h = height;
  const pad = 32;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1 || 1);
  const points = data.map((d, i) => {
    const x = pad + i * step;
    const y = h - pad - ((d.value - min) / range) * (h - pad * 2);
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="#eef2f7" strokeWidth="1" />
      ))}
      <path d={areaPath} fill="url(#lineFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
          <text x={p.x} y={h - pad + 18} textAnchor="middle" className="fill-gray-400 text-[11px]">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

export function BarChart({ data, height = 200, color = 'bg-brand-500' }: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className={`w-full rounded-t-md transition-all duration-700 ease-out ${color}`}
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="py-14 text-center">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}
