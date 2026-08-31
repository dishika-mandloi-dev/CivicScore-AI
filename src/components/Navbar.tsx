import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Menu, X, LayoutDashboard } from 'lucide-react';

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'About', href: '#about' },
  { label: 'Services Provided', href: '#services' },
  { label: 'Data & Statistics', href: '#statistics' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onLogin }: { onLogin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_-12px_rgba(15,23,42,0.18)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNav('#hero')}
          className="group flex items-center gap-2.5"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-md transition-transform duration-300 group-hover:scale-105 ${
              scrolled ? '' : 'ring-1 ring-white/30'
            }`}
          >
            <Building2 className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={`font-display text-lg font-bold tracking-tight transition-colors ${
                scrolled ? 'text-ink-900' : 'text-white'
              }`}
            >
              CivicScore AI
            </span>
            <span
              className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${
                scrolled ? 'text-ink-500' : 'text-white/70'
              }`}
            >
              Smart Ward Health Score
            </span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => handleNav(item.href)}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-ink-600 hover:text-brand-700'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <button
            onClick={onLogin}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 active:scale-95"
          >
            <LayoutDashboard className="h-4 w-4" />
            Login
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
            scrolled ? 'text-ink-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
          }`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => handleNav(item.href)}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="mt-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogin();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-md"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Login
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
