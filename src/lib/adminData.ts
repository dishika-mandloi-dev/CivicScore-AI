// Demo data layer for the CivicScore AI Admin Dashboard.
// All values are structured placeholders — ready to be replaced by a real
// backend (REST API / Node + Express + MongoDB / AI engine). Nothing here
// is claimed to be official IMC data unless a verified dataset is plugged in.

// ---------------------------------------------------------------------------
// Health-score weights (project-defined)
// ---------------------------------------------------------------------------
export const SCORE_WEIGHTS = {
  cleanliness: 0.30,
  complaints: 0.25,
  infrastructure: 0.20,
  waterSupply: 0.15,
  publicServices: 0.10,
} as const;

export type ScoreWeightKey = keyof typeof SCORE_WEIGHTS;

export const WEIGHT_LABELS: { key: ScoreWeightKey; label: string; weight: number }[] = [
  { key: 'cleanliness', label: 'Cleanliness', weight: SCORE_WEIGHTS.cleanliness },
  { key: 'complaints', label: 'Complaints', weight: SCORE_WEIGHTS.complaints },
  { key: 'infrastructure', label: 'Infrastructure', weight: SCORE_WEIGHTS.infrastructure },
  { key: 'waterSupply', label: 'Water Supply', weight: SCORE_WEIGHTS.waterSupply },
  { key: 'publicServices', label: 'Public Services', weight: SCORE_WEIGHTS.publicServices },
];

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------
export type WardStatus = 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export function statusFromScore(score: number): WardStatus {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Needs Attention';
  return 'Critical';
}

export function scoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-brand-600';
  if (score >= 55) return 'text-amber-600';
  return 'text-rose-600';
}

export function statusAccent(status: WardStatus): { text: string; bg: string; ring: string; dot: string } {
  switch (status) {
    case 'Excellent': return { text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-600/20', dot: 'bg-emerald-500' };
    case 'Good': return { text: 'text-brand-700', bg: 'bg-brand-50', ring: 'ring-brand-600/20', dot: 'bg-brand-500' };
    case 'Needs Attention': return { text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-600/20', dot: 'bg-amber-500' };
    case 'Critical': return { text: 'text-rose-700', bg: 'bg-rose-50', ring: 'ring-rose-600/20', dot: 'bg-rose-500' };
  }
}

// ---------------------------------------------------------------------------
// Ward data (Indore context, demo)
// ---------------------------------------------------------------------------
export interface Ward {
  id: number;
  wardNumber: number;
  wardName: string;
  city: string;
  municipalCorporation: string;
  healthScore: number;
  cleanliness: number;
  infrastructure: number;
  waterSupply: number;
  publicServices: number;
  complaints: number;
  coordinates: { lat: number; lng: number };
  status: WardStatus;
  lastUpdated: string;
  zone: string;
  officer: string;
}

const INDORE_AREAS: { name: string; zone: string; officer: string; lat: number; lng: number }[] = [
  { name: 'Rajwada', zone: 'Zone 1 - Central', officer: 'A. Sharma', lat: 22.7196, lng: 75.8577 },
  { name: 'Sapna Sangeeta', zone: 'Zone 2 - West', officer: 'R. Verma', lat: 22.7050, lng: 75.8310 },
  { name: 'Vijay Nagar', zone: 'Zone 3 - North', officer: 'S. Joshi', lat: 22.7490, lng: 75.8850 },
  { name: 'Palasia', zone: 'Zone 3 - North', officer: 'M. Gupta', lat: 22.7350, lng: 75.8930 },
  { name: 'Bhawarkua', zone: 'Zone 2 - West', officer: 'P. Dubey', lat: 22.7120, lng: 75.8450 },
  { name: 'A.B. Road', zone: 'Zone 1 - Central', officer: 'K. Malviya', lat: 22.7240, lng: 75.8650 },
  { name: 'L.I.G. Colony', zone: 'Zone 3 - North', officer: 'D. Singh', lat: 22.7400, lng: 75.8780 },
  { name: 'M.G. Road', zone: 'Zone 1 - Central', officer: 'V. Agrawal', lat: 22.7210, lng: 75.8620 },
  { name: 'Saket Nagar', zone: 'Zone 4 - South', officer: 'N. Chauhan', lat: 22.7250, lng: 75.8720 },
  { name: 'Bengali Square', zone: 'Zone 2 - West', officer: 'H. Rathore', lat: 22.7150, lng: 75.8400 },
  { name: 'Annapurna', zone: 'Zone 2 - West', officer: 'R. Verma', lat: 22.7080, lng: 75.8380 },
  { name: 'Devi Ahilyabai', zone: 'Zone 1 - Central', officer: 'A. Sharma', lat: 22.7170, lng: 75.8560 },
  { name: 'Pardeshipura', zone: 'Zone 2 - West', officer: 'P. Dubey', lat: 22.7100, lng: 75.8420 },
  { name: 'Khandwa Road', zone: 'Zone 4 - South', officer: 'S. Joshi', lat: 22.7280, lng: 75.8800 },
  { name: 'Super Corridor', zone: 'Zone 5 - Outer', officer: 'M. Gupta', lat: 22.7600, lng: 75.9100 },
  { name: 'Nehru Nagar', zone: 'Zone 4 - South', officer: 'D. Singh', lat: 22.7300, lng: 75.8750 },
  { name: 'Cantonment', zone: 'Zone 1 - Central', officer: 'K. Malviya', lat: 22.7180, lng: 75.8510 },
  { name: 'Chhawani', zone: 'Zone 1 - Central', officer: 'V. Agrawal', lat: 22.7160, lng: 75.8500 },
  { name: 'Gumasta Nagar', zone: 'Zone 2 - West', officer: 'N. Chauhan', lat: 22.7130, lng: 75.8390 },
  { name: 'Bhanwarkuan', zone: 'Zone 2 - West', officer: 'H. Rathore', lat: 22.7140, lng: 75.8440 },
  { name: 'Indrapuri', zone: 'Zone 3 - North', officer: 'R. Verma', lat: 22.7410, lng: 75.8790 },
  { name: 'Sukhliya', zone: 'Zone 3 - North', officer: 'P. Dubey', lat: 22.7440, lng: 75.8820 },
  { name: 'Sai Mandir', zone: 'Zone 4 - South', officer: 'A. Sharma', lat: 22.7260, lng: 75.8730 },
  { name: 'Bima Nagar', zone: 'Zone 2 - West', officer: 'S. Joshi', lat: 22.7110, lng: 75.8410 },
  { name: 'Vaishali Nagar', zone: 'Zone 4 - South', officer: 'M. Gupta', lat: 22.7270, lng: 75.8740 },
  { name: 'Ranjeet Hanuman', zone: 'Zone 1 - Central', officer: 'D. Singh', lat: 22.7220, lng: 75.8630 },
  { name: 'Khajrana', zone: 'Zone 4 - South', officer: 'K. Malviya', lat: 22.7290, lng: 75.8810 },
  { name: 'Mhow Road', zone: 'Zone 5 - Outer', officer: 'V. Agrawal', lat: 22.7000, lng: 75.8200 },
  { name: 'Dewas Naka', zone: 'Zone 5 - Outer', officer: 'N. Chauhan', lat: 22.7350, lng: 75.8300 },
  { name: 'Banganga', zone: 'Zone 1 - Central', officer: 'H. Rathore', lat: 22.7190, lng: 75.8540 },
];

function seeded(n: number, max: number, min = 30): number {
  const x = Math.sin(n * 999.137) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

export const WARDS: Ward[] = INDORE_AREAS.map((area, i) => {
  const id = i + 1;
  const infra = seeded(id, 96, 38);
  const water = seeded(id + 100, 96, 38);
  const clean = seeded(id + 200, 96, 40);
  const pub = seeded(id + 300, 96, 42);
  // Complaints parameter: lower complaint resolution issues = higher score
  const complaintsParam = seeded(id + 400, 96, 40);
  const healthScore = Math.round(
    clean * SCORE_WEIGHTS.cleanliness +
    complaintsParam * SCORE_WEIGHTS.complaints +
    infra * SCORE_WEIGHTS.infrastructure +
    water * SCORE_WEIGHTS.waterSupply +
    pub * SCORE_WEIGHTS.publicServices
  );
  return {
    id,
    wardNumber: id,
    wardName: area.name,
    city: 'Indore',
    municipalCorporation: 'Indore Municipal Corporation',
    healthScore,
    cleanliness: clean,
    infrastructure: infra,
    waterSupply: water,
    publicServices: pub,
    complaints: seeded(id + 500, 130, 6),
    coordinates: { lat: area.lat, lng: area.lng },
    status: statusFromScore(healthScore),
    lastUpdated: '2026-08-31',
    zone: area.zone,
    officer: area.officer,
  };
});

export const TOTAL_WARDS = WARDS.length;
export const getWardById = (id: number): Ward | undefined => WARDS.find((w) => w.id === id);

export const EXCELLENT_WARDS = WARDS.filter((w) => w.status === 'Excellent').length;
export const GOOD_WARDS = WARDS.filter((w) => w.status === 'Good').length;
export const NEEDS_ATTENTION_WARDS = WARDS.filter((w) => w.status === 'Needs Attention').length;
export const CRITICAL_WARDS = WARDS.filter((w) => w.status === 'Critical').length;

export const OVERALL_SCORE = Math.round(
  WARDS.reduce((s, w) => s + w.healthScore, 0) / WARDS.length
);
export const OVERALL_CLEANLINESS = Math.round(WARDS.reduce((s, w) => s + w.cleanliness, 0) / WARDS.length);
export const OVERALL_INFRASTRUCTURE = Math.round(WARDS.reduce((s, w) => s + w.infrastructure, 0) / WARDS.length);
export const OVERALL_WATER = Math.round(WARDS.reduce((s, w) => s + w.waterSupply, 0) / WARDS.length);
export const OVERALL_PUBLIC = Math.round(WARDS.reduce((s, w) => s + w.publicServices, 0) / WARDS.length);

export const SCORE_BREAKDOWN = [
  { label: 'Cleanliness', value: OVERALL_CLEANLINESS, weight: SCORE_WEIGHTS.cleanliness, color: 'bg-emerald-500' },
  { label: 'Complaints', value: 78, weight: SCORE_WEIGHTS.complaints, color: 'bg-amber-500' },
  { label: 'Infrastructure', value: OVERALL_INFRASTRUCTURE, weight: SCORE_WEIGHTS.infrastructure, color: 'bg-brand-500' },
  { label: 'Water Supply', value: OVERALL_WATER, weight: SCORE_WEIGHTS.waterSupply, color: 'bg-cyan-500' },
  { label: 'Public Services', value: OVERALL_PUBLIC, weight: SCORE_WEIGHTS.publicServices, color: 'bg-violet-500' },
];

// ---------------------------------------------------------------------------
// Complaints (demo)
// ---------------------------------------------------------------------------
export interface Complaint {
  id: string;
  wardId: number;
  ward: string;
  category: string;
  description: string;
  date: string;
  createdDate: string;
  updatedDate: string;
  priority: Priority;
  status: ComplaintStatus;
  department: string;
}

export const COMPLAINT_CATEGORIES = [
  'Cleanliness', 'Water Supply', 'Infrastructure', 'Roads', 'Street Lights', 'Public Services',
];

const CATEGORY_DEPARTMENT: Record<string, string> = {
  'Cleanliness': 'Health & Sanitation',
  'Water Supply': 'Water Supply Dept.',
  'Infrastructure': 'Public Works',
  'Roads': 'Roads & Infrastructure',
  'Street Lights': 'Street Lighting',
  'Public Services': 'General Administration',
};

const COMPLAINT_TEXT: Record<string, string> = {
  'Cleanliness': 'Garbage not collected for several days; residents report unhygienic conditions.',
  'Water Supply': 'Irregular water supply and reported leakage on the main pipeline.',
  'Infrastructure': 'Public infrastructure damaged and requires urgent repair.',
  'Roads': 'Potholes and broken road surface causing traffic hazard.',
  'Street Lights': 'Street lights non-functional for past week in the area.',
  'Public Services': 'Public service delivery delayed; citizen requests follow-up.',
};

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: ComplaintStatus[] = ['Pending', 'In Progress', 'Resolved'];

function dateFor(i: number, daysAgo: number): string {
  const d = new Date(2026, 7, 31);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export const COMPLAINTS: Complaint[] = Array.from({ length: 84 }, (_, i) => {
  const wardId = (i % TOTAL_WARDS) + 1;
  const ward = WARDS[wardId - 1];
  const cat = COMPLAINT_CATEGORIES[i % COMPLAINT_CATEGORIES.length];
  const status = i % 7 === 0 ? 'Resolved' : i % 5 === 0 ? 'In Progress' : STATUSES[i % 3];
  const priority = i % 11 === 0 ? 'Critical' : PRIORITIES[i % 4];
  const dayAgo = i % 28;
  return {
    id: `CMP-${String(1000 + i)}`,
    wardId,
    ward: ward.wardName,
    category: cat,
    description: COMPLAINT_TEXT[cat] || 'Issue reported by citizen.',
    date: dateFor(i, dayAgo),
    createdDate: dateFor(i, dayAgo),
    updatedDate: dateFor(i, Math.max(0, dayAgo - 2)),
    priority,
    status,
    department: CATEGORY_DEPARTMENT[cat] || 'General Administration',
  };
});

export const TOTAL_COMPLAINTS = WARDS.reduce((s, w) => s + w.complaints, 0);
export const ACTIVE_COMPLAINTS = COMPLAINTS.filter((c) => c.status !== 'Resolved').length;
export const PENDING_COMPLAINTS = COMPLAINTS.filter((c) => c.status === 'Pending').length;
export const INPROGRESS_COMPLAINTS = COMPLAINTS.filter((c) => c.status === 'In Progress').length;
export const RESOLVED_COMPLAINTS = COMPLAINTS.filter((c) => c.status === 'Resolved').length;
export const CRITICAL_COMPLAINTS = COMPLAINTS.filter((c) => c.priority === 'Critical').length;

export const complaintsByWard = (wardId: number): Complaint[] =>
  COMPLAINTS.filter((c) => c.wardId === wardId);

export const wardComplaintStats = (wardId: number) => {
  const list = complaintsByWard(wardId);
  return {
    total: list.length,
    pending: list.filter((c) => c.status === 'Pending').length,
    inProgress: list.filter((c) => c.status === 'In Progress').length,
    resolved: list.filter((c) => c.status === 'Resolved').length,
    critical: list.filter((c) => c.priority === 'Critical').length,
  };
};

// ---------------------------------------------------------------------------
// AI Insights (demo)
// ---------------------------------------------------------------------------
export type InsightCategory = 'Critical Alerts' | 'Performance Changes' | 'Risk Predictions' | 'Recommendations';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface AIInsight {
  id: string;
  category: InsightCategory;
  ward: string;
  wardId: number;
  issue: string;
  severity: Severity;
  explanation: string;
  recommendedAction: string;
  dateTime: string;
}

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'INS-001', category: 'Critical Alerts', ward: 'Pardeshipura', wardId: 13,
    issue: 'Infrastructure score dropped sharply', severity: 'Critical',
    explanation: 'Infrastructure performance has declined to below 50, driven by reported road damage and drainage blockages.',
    recommendedAction: 'Dispatch public works team for immediate inspection and repair.',
    dateTime: '2026-08-30 09:24',
  },
  {
    id: 'INS-002', category: 'Critical Alerts', ward: 'Mhow Road', wardId: 28,
    issue: 'Water supply score below threshold', severity: 'High',
    explanation: 'Water supply performance is trending into the critical range; supply irregularity reported.',
    recommendedAction: 'Coordinate with Water Supply Dept. to stabilize supply schedule.',
    dateTime: '2026-08-30 11:10',
  },
  {
    id: 'INS-003', category: 'Performance Changes', ward: 'Sapna Sangeeta', wardId: 2,
    issue: 'Cleanliness improving', severity: 'Low',
    explanation: 'Cleanliness score has improved over the last reporting period compared to prior months.',
    recommendedAction: 'Maintain current garbage collection cadence and monitor consistency.',
    dateTime: '2026-08-29 16:40',
  },
  {
    id: 'INS-004', category: 'Performance Changes', ward: 'Vijay Nagar', wardId: 3,
    issue: 'Complaint resolution rate increased', severity: 'Medium',
    explanation: 'Resolution rate improved as more complaints moved to Resolved status.',
    recommendedAction: 'Sustain staffing levels and replicate process in adjacent wards.',
    dateTime: '2026-08-29 14:05',
  },
  {
    id: 'INS-005', category: 'Risk Predictions', ward: 'Dewas Naka', wardId: 29,
    issue: 'Risk of infrastructure deterioration', severity: 'High',
    explanation: 'Based on recent trends, infrastructure score is projected to decline if no intervention occurs.',
    recommendedAction: 'Schedule preventive maintenance within the next reporting cycle.',
    dateTime: '2026-08-28 10:15',
  },
  {
    id: 'INS-006', category: 'Risk Predictions', ward: 'Bhawarkua', wardId: 5,
    issue: 'Water complaints likely to rise', severity: 'Medium',
    explanation: 'Water-related complaints show an upward trend that may continue without intervention.',
    recommendedAction: 'Preemptively inspect supply lines and publish a supply timetable.',
    dateTime: '2026-08-28 09:00',
  },
  {
    id: 'INS-007', category: 'Recommendations', ward: 'Rajwada', wardId: 1,
    issue: 'Improve night-time street lighting coverage', severity: 'Medium',
    explanation: 'Street light complaints cluster in evening hours; expanding coverage can reduce complaints.',
    recommendedAction: 'Audit non-functional fixtures and prioritize high-footfall streets.',
    dateTime: '2026-08-27 18:30',
  },
  {
    id: 'INS-008', category: 'Recommendations', ward: 'Super Corridor', wardId: 15,
    issue: 'Increase public service touchpoints', severity: 'Low',
    explanation: 'Growing ward population may strain existing service capacity over the next quarter.',
    recommendedAction: 'Add service desk hours and review staffing for next planning cycle.',
    dateTime: '2026-08-27 12:00',
  },
];

export const insightsByWard = (wardId: number): AIInsight[] =>
  AI_INSIGHTS.filter((i) => i.wardId === wardId);

export const wardInsight = (wardId: number): AIInsight => {
  const own = insightsByWard(wardId);
  if (own.length > 0) return own[0];
  const ward = getWardById(wardId);
  // Generate a ward-relevant insight deterministically
  const w = ward!;
  if (w.waterSupply < 55) {
    return {
      id: `INS-W${w.id}`, category: 'Risk Predictions', ward: w.wardName, wardId: w.id,
      issue: 'Water supply performance declining', severity: 'High',
      explanation: `Water supply score for ${w.wardName} is ${w.waterSupply}/100, below the recommended threshold.`,
      recommendedAction: 'Inspect supply pipelines and review distribution schedule.',
      dateTime: '2026-08-30 08:00',
    };
  }
  if (w.infrastructure < 55) {
    return {
      id: `INS-W${w.id}`, category: 'Critical Alerts', ward: w.wardName, wardId: w.id,
      issue: 'Infrastructure needs attention', severity: 'High',
      explanation: `Infrastructure score for ${w.wardName} is ${w.infrastructure}/100, indicating deterioration.`,
      recommendedAction: 'Prioritize road and drainage repairs in this ward.',
      dateTime: '2026-08-30 08:00',
    };
  }
  if (w.cleanliness < 55) {
    return {
      id: `INS-W${w.id}`, category: 'Performance Changes', ward: w.wardName, wardId: w.id,
      issue: 'Cleanliness below target', severity: 'Medium',
      explanation: `Cleanliness score for ${w.wardName} is ${w.cleanliness}/100, below the city average.`,
      recommendedAction: 'Increase garbage collection frequency and deploy sanitation staff.',
      dateTime: '2026-08-30 08:00',
    };
  }
  return {
    id: `INS-W${w.id}`, category: 'Recommendations', ward: w.wardName, wardId: w.id,
    issue: 'Stable performance — maintain standards', severity: 'Low',
    explanation: `${w.wardName} is performing above target across most parameters. Maintain current operations.`,
    recommendedAction: 'Continue monitoring and share best practices with neighboring wards.',
    dateTime: '2026-08-30 08:00',
  };
};

// ---------------------------------------------------------------------------
// Notifications (demo, in-memory mutable state held by component)
// ---------------------------------------------------------------------------
export type NotificationType =
  | 'Health Score Alert' | 'Critical Ward' | 'Complaint Escalation'
  | 'Infrastructure' | 'Water Supply' | 'Cleanliness' | 'AI Insight';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  message: string;
  ward: string;
  wardId: number;
  severity: Severity;
  dateTime: string;
  read: boolean;
}

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  { id: 'N-01', type: 'Critical Ward', message: 'Ward 13 — Pardeshipura health score dropped to critical.', ward: 'Pardeshipura', wardId: 13, severity: 'Critical', dateTime: '2026-08-31 08:12', read: false },
  { id: 'N-02', type: 'Water Supply', message: 'Water supply issues reported in Mhow Road ward.', ward: 'Mhow Road', wardId: 28, severity: 'High', dateTime: '2026-08-31 07:55', read: false },
  { id: 'N-03', type: 'Complaint Escalation', message: 'Complaint CMP-1006 escalated to Critical priority.', ward: 'Bhawarkua', wardId: 5, severity: 'High', dateTime: '2026-08-30 18:40', read: false },
  { id: 'N-04', type: 'Infrastructure', message: 'Infrastructure deterioration detected in Dewas Naka.', ward: 'Dewas Naka', wardId: 29, severity: 'Medium', dateTime: '2026-08-30 15:20', read: true },
  { id: 'N-05', type: 'AI Insight', message: 'AI flagged rising water complaints trend in Bhawarkua.', ward: 'Bhawarkua', wardId: 5, severity: 'Medium', dateTime: '2026-08-30 10:05', read: false },
  { id: 'N-06', type: 'Health Score Alert', message: 'City overall health score updated to ' + OVERALL_SCORE + '/100.', ward: 'All Wards', wardId: 0, severity: 'Low', dateTime: '2026-08-30 06:00', read: true },
  { id: 'N-07', type: 'Cleanliness', message: 'Cleanliness performance improving in Sapna Sangeeta.', ward: 'Sapna Sangeeta', wardId: 2, severity: 'Low', dateTime: '2026-08-29 17:10', read: true },
];

// ---------------------------------------------------------------------------
// Trend data (demo)
// ---------------------------------------------------------------------------
export const HEALTH_TREND = {
  '1m': [
    { label: 'W1', value: 81 }, { label: 'W2', value: 80 }, { label: 'W3', value: 82 },
    { label: 'W4', value: OVERALL_SCORE },
  ],
  '3m': [
    { label: 'Jun', value: 79 }, { label: 'Jul', value: 81 },
    { label: 'Aug', value: 80 }, { label: 'Now', value: OVERALL_SCORE },
  ],
  '6m': [
    { label: 'Mar', value: 76 }, { label: 'Apr', value: 78 }, { label: 'May', value: 77 },
    { label: 'Jun', value: 79 }, { label: 'Jul', value: 81 }, { label: 'Aug', value: OVERALL_SCORE },
  ],
};

export const COMPLAINT_DONUT = [
  { label: 'Pending', count: PENDING_COMPLAINTS, color: 'bg-amber-500' },
  { label: 'In Progress', count: INPROGRESS_COMPLAINTS, color: 'bg-brand-500' },
  { label: 'Resolved', count: RESOLVED_COMPLAINTS, color: 'bg-emerald-500' },
];

export const WARD_STATUS_DISTRIBUTION = [
  { label: 'Excellent', count: EXCELLENT_WARDS, color: 'bg-emerald-500' },
  { label: 'Good', count: GOOD_WARDS, color: 'bg-brand-500' },
  { label: 'Needs Attention', count: NEEDS_ATTENTION_WARDS, color: 'bg-amber-500' },
  { label: 'Critical', count: CRITICAL_WARDS, color: 'bg-rose-500' },
];

// ---------------------------------------------------------------------------
// AI process steps (for Health Score page)
// ---------------------------------------------------------------------------
export const AI_PROCESS_STEPS = [
  { label: 'Ward Data', desc: 'Collect parameter inputs from each ward.' },
  { label: 'Data Cleaning', desc: 'Normalize and validate incoming data.' },
  { label: 'AI Analysis', desc: 'Detect anomalies and performance patterns.' },
  { label: 'Health Score Calculation', desc: 'Apply weighted formula to parameters.' },
  { label: 'Prediction & Insights', desc: 'Generate forecasts and recommendations.' },
  { label: 'Dashboard Update', desc: 'Publish scores and insights to the dashboard.' },
];

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};
