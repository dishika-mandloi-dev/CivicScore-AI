import { motion } from 'framer-motion';
import {
  HeartPulse,
  DatabaseZap,
  BrainCircuit,
  LayoutGrid,
  ShieldAlert,
  FileBarChart,
  Cpu,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const SERVICES = [
  {
    icon: HeartPulse,
    title: 'Ward Health Assessment',
    desc: 'Generate a comprehensive 0–100 Smart Ward Health Score for every ward using AI analysis of civic parameters.',
    accent: 'from-brand-500 to-brand-700',
  },
  {
    icon: DatabaseZap,
    title: 'Civic Data Integration',
    desc: 'Unify cleanliness, complaints, infrastructure, water and public service data from multiple departments into one system.',
    accent: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Based Decision Support',
    desc: 'Get AI-generated recommendations on where to prioritize resources, interventions and development activity.',
    accent: 'from-brand-500 to-emerald-600',
  },
  {
    icon: LayoutGrid,
    title: 'Resource Planning & Allocation',
    desc: 'Optimize budgets, manpower and materials by directing them to wards that need attention the most.',
    accent: 'from-amber-500 to-amber-600',
  },
  {
    icon: ShieldAlert,
    title: 'Early Risk Detection',
    desc: 'Predictive models flag wards at risk of service breakdowns, sanitation issues or complaint spikes before they escalate.',
    accent: 'from-rose-500 to-rose-600',
  },
  {
    icon: FileBarChart,
    title: 'Governance Performance Reporting',
    desc: 'Automated dashboards and reports for review meetings, audits and citizen-facing transparency portals.',
    accent: 'from-brand-500 to-brand-700',
  },
  {
    icon: Cpu,
    title: 'Smart City Digital Solutions',
    desc: 'IoT-ready integrations, geo-tagged maps and real-time monitoring for a connected smart city ecosystem.',
    accent: 'from-emerald-500 to-brand-600',
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,rgba(25,135,84,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services Provided"
          title={
            <>
              Built for{' '}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                smarter governance
              </span>
            </>
          }
          subtitle="A suite of AI-powered services that turn municipal data into decisions, dashboards and action."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-card)]"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} opacity-10 transition-all duration-500 group-hover:scale-125 group-hover:opacity-20`}
              />
              <div
                className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.accent} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {s.desc}
              </p>
              <div className="mt-5 h-0.5 w-10 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-300 group-hover:w-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
