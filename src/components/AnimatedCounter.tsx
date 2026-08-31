import { useEffect, useRef, useState } from 'react';
import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from 'framer-motion';

type Props = {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

export default function AnimatedCounter({
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on('change', (v) =>
      setDisplay(v.toLocaleString('en-IN'))
    );
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, to, duration, count, rounded]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function CounterLabel({
  value,
  label,
  icon,
  accent = 'brand',
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  accent?: 'brand' | 'emerald' | 'amber' | 'rose';
}) {
  const accentMap: Record<string, string> = {
    brand: 'from-brand-500 to-brand-700',
    emerald: 'from-emerald-500 to-emerald-700',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accentMap[accent]} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}
      />
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]} text-white shadow-md`}
      >
        {icon}
      </div>
      <div className="font-display text-4xl font-bold tracking-tight text-ink-900">
        <AnimatedCounter to={value} />
      </div>
      <p className="mt-1 text-sm font-medium text-ink-500">{label}</p>
    </motion.div>
  );
}
