import { motion } from 'framer-motion';
import {
  Map,
  HeartPulse,
  AlertTriangle,
  ClipboardCheck,
  Building,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { CounterLabel } from './AnimatedCounter';

const STATS = [
  { value: 85, label: 'Number of Wards', icon: <Map className="h-6 w-6" />, accent: 'brand' as const },
  { value: 67, label: 'Healthy Wards', icon: <HeartPulse className="h-6 w-6" />, accent: 'emerald' as const },
  { value: 142, label: 'Number of Complaints', icon: <AlertTriangle className="h-6 w-6" />, accent: 'amber' as const },
  { value: 980, label: 'Number of Surveys Conducted', icon: <ClipboardCheck className="h-6 w-6" />, accent: 'brand' as const },
  { value: 13, label: 'Departments in IMC', icon: <Building className="h-6 w-6" />, accent: 'emerald' as const },
];

export default function Statistics() {
  return (
    <section id="statistics" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Data & Statistics"
          title={
            <>
              Real-time{' '}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                civic intelligence
              </span>
            </>
          }
          subtitle="A snapshot of Indore's wards, complaints and surveys — the foundation of the Smart Ward Health Score."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <CounterLabel {...s} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
