import { Building2, Mail, Phone, MapPin, ArrowUp, ExternalLink } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'About', href: '#about' },
  { label: 'Services Provided', href: '#services' },
  { label: 'Data & Statistics', href: '#statistics' },
  { label: 'Contact', href: '#contact' },
];

const GOV_LINKS = [
  { label: 'Indore Municipal Corporation', href: 'https://imcindore.mp.gov.in/' },
  { label: 'Smart Cities Mission', href: 'https://smartcities.gov.in/' },
  { label: 'Swachh Bharat Mission', href: 'https://swachhbharatmission.ddws.gov.in/' },
  { label: 'Government of Madhya Pradesh', href: 'https://www.mp.gov.in/' },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden bg-ink-900 text-slate-300">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(11,94,215,0.18),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-white">
                  CivicScore AI
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Smart Ward Health Score System
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              An AI-powered smart governance platform that transforms municipal
              ward data into actionable insights for efficient, transparent and
              data-driven urban management.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-slate-400">
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-400" /> 1234567890
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-400" /> projecthead@civicscore.gov.in
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-400" /> Indore, Madhya Pradesh
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-sm text-slate-400 transition-colors hover:text-emerald-300"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Government theme */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Government
            </h4>
            <ul className="mt-5 space-y-3">
              {GOV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-emerald-300"
                  >
                    {l.label}
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Designed for */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Designed For
            </h4>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">
                Indore Municipal Corporation
              </p>
              <p className="mt-1 text-xs text-slate-400">
                In service of cleaner, smarter and more transparent urban
                governance for the citizens of Indore.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CivicScore AI — Smart Ward Health Score
            System. All rights reserved.
          </p>
          <button
            onClick={toTop}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-emerald-300/40 hover:text-emerald-300"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
