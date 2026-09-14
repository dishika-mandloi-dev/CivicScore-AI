import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  LogOut,
  ArrowLeft,
  User as UserIcon,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  ClipboardList,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Droplets,
  HardHat,
  Sparkles,
  Heart,
  Calendar,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { WARDS, getWardById, COMPLAINT_CATEGORIES, statusFromScore, scoreColor, type Ward } from '@/lib/adminData';
import { Card, ProgressBar, WardStatusBadge, ComplaintStatusBadge, ScoreGauge, EmptyState } from '@/components/admin/ui';

type Tab = 'overview' | 'complaints' | 'survey';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  ward_id: number;
}

interface UserComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  ward_id: number;
  created_at: string;
}

interface UserSurvey {
  id: string;
  cleanliness_rating: number;
  infrastructure_rating: number;
  water_supply_rating: number;
  public_services_rating: number;
  overall_rating: number;
  comments: string | null;
  created_at: string;
}

export default function UserDashboard({ onLogout, onBack }: { onLogout: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Unable to load your account. Please log in again.');
      setLoading(false);
      return;
    }
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, ward_id')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) {
      setError('Unable to load your profile. Please try again.');
      setLoading(false);
      return;
    }
    if (!data) {
      setError('Your profile is being set up. Please refresh in a moment.');
      setLoading(false);
      return;
    }
    setProfile(data as Profile);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const ward: Ward | undefined = profile ? getWardById(profile.ward_id) : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
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
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            <p className="mt-3 text-sm text-gray-500">Loading your dashboard...</p>
          </div>
        )}

        {error && !loading && (
          <Card className="p-6">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </Card>
        )}

        {profile && !loading && !error && (
          <>
            {/* Welcome banner */}
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Welcome, {profile.full_name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Your assigned ward is Ward {String(profile.ward_id).padStart(2, '0')}
                {ward ? ` — ${ward.wardName}` : ''}, Indore.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto">
              {([
                { id: 'overview' as const, label: 'Overview', icon: UserIcon },
                { id: 'complaints' as const, label: 'Complaints', icon: MessageSquare },
                { id: 'survey' as const, label: 'Survey', icon: ClipboardList },
              ]).map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                      tab === t.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-gray-600 ring-1 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === 'overview' && <OverviewTab profile={profile} ward={ward} />}
                {tab === 'complaints' && <ComplaintsTab profile={profile} ward={ward} />}
                {tab === 'survey' && <SurveyTab profile={profile} ward={ward} />}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview Tab
// ---------------------------------------------------------------------------
function OverviewTab({ profile, ward }: { profile: Profile; ward: Ward | undefined }) {
  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-gray-900">My Profile</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
              <UserIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-900 break-all">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-gray-500">Assigned Ward</p>
              <p className="text-sm font-semibold text-gray-900">
                Ward {String(profile.ward_id).padStart(2, '0')}
                {ward ? ` — ${ward.wardName}, ${ward.city}` : ''}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Your ward is assigned automatically by the system and cannot be changed.
        </p>
      </Card>

      {/* Ward details */}
      {ward ? (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-gray-900">My Ward Details</h2>
            <WardStatusBadge status={ward.status} />
          </div>
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
            <div className="flex flex-shrink-0 flex-col items-center">
              <ScoreGauge score={ward.healthScore} size={132} />
              <span className="mt-2 text-sm font-semibold text-gray-700">
                Status: <span className={scoreColor(ward.healthScore)}>{statusFromScore(ward.healthScore)}</span>
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <ProgressBar label="Cleanliness" value={ward.cleanliness} color="bg-emerald-500" />
              <ProgressBar label="Infrastructure" value={ward.infrastructure} color="bg-brand-500" />
              <ProgressBar label="Water Supply" value={ward.waterSupply} color="bg-cyan-500" />
              <ProgressBar label="Public Services" value={ward.publicServices} color="bg-violet-500" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniInfo icon={MapPin} label="Zone" value={ward.zone} />
            <MiniInfo icon={UserIcon} label="Ward Officer" value={ward.officer} />
            <MiniInfo icon={Calendar} label="Last Updated" value={ward.lastUpdated} />
            <MiniInfo icon={MessageSquare} label="Total Complaints" value={String(ward.complaints)} />
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <EmptyState title="Ward data unavailable" subtitle="Your assigned ward details could not be loaded." />
        </Card>
      )}
    </div>
  );
}

function MiniInfo({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Complaints Tab
// ---------------------------------------------------------------------------
function ComplaintsTab({ profile, ward }: { profile: Profile; ward: Ward | undefined }) {
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const loadComplaints = useCallback(async () => {
    setLoadingList(true);
    const { data, error: queryError } = await supabase
      .from('user_complaints')
      .select('id, title, description, category, status, ward_id, created_at')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    if (!queryError && data) {
      setComplaints(data as UserComplaint[]);
    }
    setLoadingList(false);
  }, [profile.id]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);
    if (!title.trim() || !description.trim()) {
      setFormError('Please fill in the title and description.');
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase.from('user_complaints').insert({
      user_id: profile.id,
      ward_id: profile.ward_id,
      title: title.trim(),
      description: description.trim(),
      category,
    });
    setSubmitting(false);
    if (insertError) {
      setFormError(insertError.message || 'Unable to submit your complaint. Please try again.');
      return;
    }
    setSuccess(true);
    setTitle('');
    setDescription('');
    setCategory(COMPLAINT_CATEGORIES[0]);
    setShowForm(false);
    loadComplaints();
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Your complaint has been submitted successfully.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">My Complaints</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complaints are automatically associated with your ward
            {ward ? ` (Ward ${String(ward.id).padStart(2, '0')} — ${ward.wardName})` : ''}.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'New Complaint'}
        </button>
      </div>

      {/* Complaint form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <Card className="p-6">
              <h3 className="font-display text-base font-bold text-gray-900">Register a Complaint</h3>
              {formError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Title / Subject</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title for your complaint"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-400/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-400/20"
                  >
                    {COMPLAINT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the issue in detail..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-400/20"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  Ward: {String(profile.ward_id).padStart(2, '0')}
                  {ward ? ` — ${ward.wardName}` : ''} (auto-assigned, cannot be changed)
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaints list */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <h3 className="text-sm font-bold text-gray-900">Submitted Complaints ({complaints.length})</h3>
        </div>
        {loadingList ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : complaints.length === 0 ? (
          <EmptyState title="No complaints yet" subtitle="Click 'New Complaint' to file your first complaint." />
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <div key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{c.category}</p>
                    <p className="mt-1.5 text-sm text-gray-600">{c.description}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <ComplaintStatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Survey Tab
// ---------------------------------------------------------------------------
function SurveyTab({ profile, ward }: { profile: Profile; ward: Ward | undefined }) {
  const [surveys, setSurveys] = useState<UserSurvey[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    infrastructure: 0,
    waterSupply: 0,
    publicServices: 0,
    overall: 0,
  });
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const loadSurveys = useCallback(async () => {
    setLoadingList(true);
    const { data, error: queryError } = await supabase
      .from('user_surveys')
      .select('id, cleanliness_rating, infrastructure_rating, water_supply_rating, public_services_rating, overall_rating, comments, created_at')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    if (!queryError && data) {
      setSurveys(data as UserSurvey[]);
    }
    setLoadingList(false);
  }, [profile.id]);

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);
    if (ratings.cleanliness === 0 || ratings.infrastructure === 0 || ratings.waterSupply === 0 || ratings.publicServices === 0 || ratings.overall === 0) {
      setFormError('Please rate all categories before submitting.');
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase.from('user_surveys').insert({
      user_id: profile.id,
      ward_id: profile.ward_id,
      cleanliness_rating: ratings.cleanliness,
      infrastructure_rating: ratings.infrastructure,
      water_supply_rating: ratings.waterSupply,
      public_services_rating: ratings.publicServices,
      overall_rating: ratings.overall,
      comments: comments.trim() || null,
    });
    setSubmitting(false);
    if (insertError) {
      setFormError(insertError.message || 'Unable to submit your survey. Please try again.');
      return;
    }
    setSuccess(true);
    setRatings({ cleanliness: 0, infrastructure: 0, waterSupply: 0, publicServices: 0, overall: 0 });
    setComments('');
    loadSurveys();
    setTimeout(() => setSuccess(false), 4000);
  };

  const surveyFields = [
    { key: 'cleanliness' as const, label: 'Cleanliness', icon: Sparkles, color: 'text-emerald-600' },
    { key: 'infrastructure' as const, label: 'Infrastructure', icon: HardHat, color: 'text-brand-600' },
    { key: 'waterSupply' as const, label: 'Water Supply', icon: Droplets, color: 'text-cyan-600' },
    { key: 'publicServices' as const, label: 'Public Services', icon: Heart, color: 'text-violet-600' },
    { key: 'overall' as const, label: 'Overall Ward Health', icon: Building2, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Your survey has been submitted. Thank you for your feedback!
        </div>
      )}

      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-gray-900">Ward Health Survey</h2>
        <p className="mt-1 text-sm text-gray-500">
          Rate your experience with civic services in your ward
          {ward ? ` (Ward ${String(ward.id).padStart(2, '0')} — ${ward.wardName})` : ''}.
        </p>
        {formError && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
            <AlertCircle className="h-4 w-4" />
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {surveyFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key}>
                <div className="mb-2 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${field.color}`} />
                  <span className="text-sm font-medium text-gray-700">{field.label}</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatings((prev) => ({ ...prev, [field.key]: star }))}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                        ratings[field.key] >= star
                          ? 'border-brand-400 bg-brand-500 text-white'
                          : 'border-slate-200 bg-white text-gray-400 hover:border-brand-300 hover:bg-brand-50'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Additional Comments (optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder="Share any specific feedback or suggestions..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-400/20"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            Ward: {String(profile.ward_id).padStart(2, '0')}
            {ward ? ` — ${ward.wardName}` : ''} (auto-assigned, cannot be changed)
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </form>
      </Card>

      {/* Previous surveys */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <h3 className="text-sm font-bold text-gray-900">My Previous Surveys ({surveys.length})</h3>
        </div>
        {loadingList ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : surveys.length === 0 ? (
          <EmptyState title="No surveys submitted yet" subtitle="Your survey submissions will appear here." />
        ) : (
          <div className="divide-y divide-slate-100">
            {surveys.map((s) => (
              <div key={s.id} className="p-4">
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Cleanliness', value: s.cleanliness_rating },
                    { label: 'Infrastructure', value: s.infrastructure_rating },
                    { label: 'Water', value: s.water_supply_rating },
                    { label: 'Public Svcs', value: s.public_services_rating },
                    { label: 'Overall', value: s.overall_rating },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
                      <span className="text-xs text-gray-500">{r.label}</span>
                      <span className="text-sm font-bold text-brand-600">{r.value}/5</span>
                    </div>
                  ))}
                </div>
                {s.comments && <p className="mt-2 text-sm text-gray-600">{s.comments}</p>}
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
