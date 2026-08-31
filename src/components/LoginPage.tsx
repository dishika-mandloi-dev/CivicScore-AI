import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  ArrowLeft,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { RAJWADA_LOGIN } from '@/lib/assets';
import { ADMIN_CREDENTIALS } from '@/lib/adminData';

export default function LoginPage({
  onBack,
  onLogin,
}: {
  onBack: () => void;
  onLogin: () => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      if (remember) {
        sessionStorage.setItem('civicscore_admin', 'true');
      }
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Blurred Rajwada background */}
      <div className="absolute inset-0 -z-20">
        <img
          src={RAJWADA_LOGIN}
          alt="Rajwada Palace, Indore"
          className="h-full w-full scale-110 object-cover blur-sm"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-900/80 via-brand-900/70 to-emerald-900/70" />

      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10 sm:px-6">
        <button
          onClick={onBack}
          className="group mb-6 inline-flex items-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl sm:p-10"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold text-gray-900">
              Admin Login
            </h1>
            <p className="mt-1.5 text-sm text-gray-600">
              Sign in to the CivicScore AI dashboard
            </p>
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="group relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3.5 pl-11 pr-11 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="group flex items-center gap-2 text-sm text-gray-700"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                    remember
                      ? 'border-emerald-400 bg-emerald-500'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {remember && <ShieldCheck className="h-3.5 w-3.5 text-white" />}
                </span>
                Remember Me
              </button>
              <button
                type="button"
                className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition-all hover:shadow-xl hover:brightness-110 active:scale-95"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Authorized personnel only. Demo credentials: admin / admin123
          </p>
        </motion.div>
      </div>
    </div>
  );
}
