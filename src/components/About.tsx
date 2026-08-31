import { motion } from 'framer-motion';
import {
  Building2,
  Target,
  Landmark,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const IMC_URL = 'https://imcindore.mp.gov.in/';
const MAYOR_URL = 'https://imcindore.mp.gov.in/mayor';

const CARDS = [
  {
    id: 'about-imc',
    icon: Building2,
    title: 'About IMC',
    desc: 'Indore Municipal Corporation — the civic body governing the cleanest city of India.',
    cta: 'Read More',
    href: IMC_URL,
    external: true,
  },
  {
    id: 'about-project',
    icon: Target,
    title: 'About Project',
    desc: 'An AI-powered Smart Ward Health Score System for data-driven urban governance.',
    cta: 'Read More',
    href: '#about-project',
    external: false,
  },
  {
    id: 'about-mayor',
    icon: Landmark,
    title: 'About Mayor',
    desc: 'Leadership driving Indore towards a smarter, cleaner and more efficient future.',
    cta: 'Know More',
    href: MAYOR_URL,
    external: true,
  },
];

export default function About() {
  const handleClick = (card: (typeof CARDS)[number]) => {
    if (card.external) {
      window.open(card.href, '_blank', 'noopener,noreferrer');
      return;
    }
    document.querySelector(card.href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              Know the{' '}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                people, project & city
              </span>
            </>
          }
          subtitle="Explore the Indore Municipal Corporation, the CivicScore AI project, and the leadership behind the initiative."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => handleClick(card)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-7 text-left shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-card)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-brand-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <card.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {card.desc}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                {card.cta}
                {card.external ? (
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-20">
          <AboutProject />
        </div>
      </div>
    </section>
  );
}

function AboutProject() {
  const paras = [
    'CivicScore AI is an AI-powered Smart Ward Health Score System developed to help municipal authorities monitor, evaluate, and improve the overall performance of city wards. The platform brings together ward-related data from different civic departments into a single centralized system, making it easier to track the health and development status of every ward.',
    'The system works by collecting data related to key civic parameters such as cleanliness, citizen complaints, infrastructure, water supply, and public services. This data is processed using AI algorithms to generate a Smart Ward Health Score for each ward. Based on the analysis, the platform provides real-time dashboards, interactive maps, predictive insights, and automated alerts, enabling authorities to identify high-priority areas and take timely action.',
    'CivicScore AI was developed to address the challenges of fragmented municipal data, slow decision-making, and the lack of AI-driven insights in urban governance. By transforming raw civic data into meaningful analytics, the platform helps government officials make faster, more informed, and data-driven decisions while improving transparency, operational efficiency, and resource allocation.',
    'The platform is designed primarily for Municipal Corporations, Smart City Authorities, Urban Local Bodies (ULBs), Government Officials, Ward Administrators, and Decision Makers who are responsible for planning, monitoring, and improving public services. It can also support administrators in identifying underperforming wards, prioritizing development activities, and delivering better services to citizens through smarter governance.',
  ];
  return (
    <ScrollReveal id="about-project">
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 shadow-[var(--shadow-soft)] sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Target className="h-3.5 w-3.5" />
              About Project
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              The CivicScore AI Project
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-4">
            {[
              ['Cleanliness', 'bg-emerald-500'],
              ['Water', 'bg-brand-500'],
              ['Complaints', 'bg-amber-500'],
            ].map(([label, color]) => (
              <div key={label} className="text-center">
                <span className={`mx-auto mb-1.5 block h-2 w-2 rounded-full ${color}`} />
                <span className="text-[11px] font-medium text-ink-500">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {paras.map((p, i) => (
            <p key={i} className="leading-relaxed text-ink-600">
              {p}
            </p>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
