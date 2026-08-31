import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const OVERVIEW_TEXT =
  'CivicScore AI is an AI-powered smart governance platform that transforms municipal ward data into actionable insights. By analyzing key civic indicators such as cleanliness, infrastructure, public services, water supply, and citizen complaints, the platform generates a comprehensive Smart Ward Health Score. It enables government authorities to monitor ward performance in real time, identify priority areas, and make faster, data-driven decisions for efficient urban management and improved public service delivery.';

export default function Overview() {
  return (
    <section id="overview" className="relative bg-slate-50 py-24 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(11,94,215,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-10 flex items-center justify-center gap-3 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-md">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
              Overview
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto px-6 py-6 text-center"
          >
            <p className="text-base leading-relaxed text-ink-600 sm:text-lg">
              {OVERVIEW_TEXT}
            </p>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
