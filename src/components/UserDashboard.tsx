import { Building2, LogOut, ArrowLeft } from 'lucide-react';

export default function UserDashboard({ onLogout, onBack }: { onLogout: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-md">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold text-gray-900">CivicScore AI</span>
              <span className="text-[11px] font-medium text-gray-500">Citizen Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-2xl font-bold text-gray-900">Welcome to CivicScore AI</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            You are signed in as a citizen. Your dashboard features — filing complaints, viewing ward
            information, and participating in surveys — will be available here soon.
          </p>
        </div>
      </main>
    </div>
  );
}
