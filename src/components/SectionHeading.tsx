import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  id?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  id,
}: Props) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <ScrollReveal>
      <div id={id} className={`max-w-3xl ${alignment} mb-12`}>
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            {eyebrow}
          </motion.span>
        )}
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-base leading-relaxed text-ink-500 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
