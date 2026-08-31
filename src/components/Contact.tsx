import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, User, Building2, Clock } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(11,94,215,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Get in touch with the{' '}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                project team
              </span>
            </>
          }
          subtitle="Reach out to the Project Head for demos, partnerships or queries about CivicScore AI."
        />

        <div className="mx-auto mt-10 max-w-4xl">
          <ScrollReveal>
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
              {/* Left: project head card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-600 p-8 text-white shadow-[var(--shadow-card)]">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-white/5" />
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold">Project Head</h3>
                  <p className="mt-1 text-sm text-white/80">
                    CivicScore AI – Smart Ward Health Score System
                  </p>
                  <div className="mt-6 space-y-4">
                    <ContactRow icon={<Phone className="h-4 w-4" />} label="Phone" value="1234567890" />
                    <ContactRow icon={<Mail className="h-4 w-4" />} label="Email" value="projecthead@civicscore.gov.in" />
                    <ContactRow
                      icon={<Building2 className="h-4 w-4" />}
                      label="Department"
                      value="Indore Municipal Corporation"
                    />
                    <ContactRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value="Indore, Madhya Pradesh"
                    />
                  </div>
                </div>
              </div>

              {/* Right: message form (UI only) */}
              <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-[var(--shadow-soft)]">
                <h3 className="font-display text-xl font-semibold text-ink-900">
                  Send a message
                </h3>
                <p className="mt-1 text-sm text-ink-500">
                  Fill in your details and the team will get back to you.
                </p>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your Name" placeholder="Full name" />
                    <Field label="Phone" placeholder="10-digit number" />
                  </div>
                  <Field label="Email" placeholder="name@example.com" type="email" />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write your message..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink-800 outline-none transition-all placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-95"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InfoPill
                icon={<Clock className="h-5 w-5" />}
                title="Office Hours"
                value="Mon–Fri, 9:30 AM – 6:00 PM"
              />
              <InfoPill
                icon={<Phone className="h-5 w-5" />}
                title="Helpline"
                value="1234567890"
              />
              <InfoPill
                icon={<MapPin className="h-5 w-5" />}
                title="Address"
                value="IMC Headquarters, Indore, MP"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-white/15 pt-4">
      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
        {icon}
      </span>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-white/60">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink-800 outline-none transition-all placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}

function InfoPill({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-md">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {title}
        </p>
        <p className="text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </motion.div>
  );
}
