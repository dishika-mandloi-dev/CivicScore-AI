import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, MapPin, User as UserIcon, Mail, Star, MessageSquare } from 'lucide-react';
import { Card, EmptyState } from '../ui';
import { WARDS, getWardById } from '@/lib/adminData';
import { ADMIN_CREDENTIALS } from '@/lib/adminData';

interface SurveyResponse {
  id: string;
  user_id: string;
  ward_id: number;
  user_email: string;
  user_name: string;
  cleanliness_rating: number;
  infrastructure_rating: number;
  water_supply_rating: number;
  public_services_rating: number;
  overall_rating: number;
  comments: string | null;
  created_at: string;
}

export default function SurveyResponsesPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wardFilter, setWardFilter] = useState<number | 'all'>('all');

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
      const res = await fetch(`${supabaseUrl}/functions/v1/admin-survey-responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({
          username: ADMIN_CREDENTIALS.username,
          password: ADMIN_CREDENTIALS.password,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      if (!data || !Array.isArray(data.responses)) {
        throw new Error('Unexpected response format');
      }
      setResponses(data.responses as SurveyResponse[]);
    } catch (err: any) {
      setError(err.message || 'Unable to load survey responses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const filtered = wardFilter === 'all'
    ? responses
    : responses.filter((r) => r.ward_id === wardFilter);

  const wardsWithSurveys = [...new Set(responses.map((r) => r.ward_id))].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Survey Responses</h1>
        <p className="mt-1 text-sm text-gray-500">
          Citizen survey submissions across all wards ({responses.length} total).
        </p>
      </div>

      {/* Ward filter */}
      {wardsWithSurveys.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setWardFilter('all')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              wardFilter === 'all' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-gray-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            All Wards
          </button>
          {wardsWithSurveys.map((wid) => {
            const w = getWardById(wid);
            return (
              <button
                key={wid}
                onClick={() => setWardFilter(wid)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  wardFilter === wid ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-gray-600 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                W{String(wid).padStart(2, '0')}{w ? ` ${w.wardName}` : ''}
              </button>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
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

      {!loading && !error && filtered.length === 0 && (
        <Card className="p-6">
          <EmptyState
            title="No survey responses"
            subtitle={wardFilter !== 'all' ? 'No surveys for this ward yet.' : 'Citizen survey submissions will appear here.'}
          />
        </Card>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((r) => {
            const ward = getWardById(r.ward_id);
            return (
              <Card key={r.id} className="p-5">
                {/* User + ward header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <UserIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{r.user_name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {r.user_email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      Ward {String(r.ward_id).padStart(2, '0')}{ward ? ` — ${ward.wardName}` : ''}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Ratings */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <RatingPill label="Cleanliness" value={r.cleanliness_rating} color="text-emerald-600" />
                  <RatingPill label="Infrastructure" value={r.infrastructure_rating} color="text-brand-600" />
                  <RatingPill label="Water Supply" value={r.water_supply_rating} color="text-cyan-600" />
                  <RatingPill label="Public Services" value={r.public_services_rating} color="text-violet-600" />
                  <RatingPill label="Overall" value={r.overall_rating} color="text-amber-600" />
                </div>

                {/* Comments */}
                {r.comments && (
                  <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Comments
                    </div>
                    <p className="mt-1.5 text-sm text-gray-700">{r.comments}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RatingPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-center">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-1">
        <span className={`text-lg font-bold ${color}`}>{value}</span>
        <span className="text-xs text-gray-400">/5</span>
      </div>
      <div className="mt-1 flex justify-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-3 w-3 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
