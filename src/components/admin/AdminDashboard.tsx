import { useState } from 'react';
import AdminLayout, { type AdminPage } from './AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';
import WardsPage from './pages/WardsPage';
import WardDetailPage from './pages/WardDetailPage';
import HealthScorePage from './pages/HealthScorePage';
import AIInsightsPage from './pages/AIInsightsPage';
import MapWardsPage from './pages/MapWardsPage';
import NotificationsPage from './pages/NotificationsPage';
import SurveyResponsesPage from './pages/SurveyResponsesPage';
import { INITIAL_NOTIFICATIONS } from '@/lib/adminData';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [selectedWardId, setSelectedWardId] = useState<number>(1);

  const unreadCount = INITIAL_NOTIFICATIONS.filter((n) => !n.read).length;

  const handleNavigate = (p: AdminPage) => setPage(p);

  const handleSelectWard = (id: number) => {
    setSelectedWardId(id);
    setPage('ward-detail');
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'complaints':
        return <ComplaintsPage />;
      case 'wards':
        return <WardsPage onNavigate={handleNavigate} onSelectWard={handleSelectWard} />;
      case 'ward-detail':
        return (
          <WardDetailPage
            wardId={selectedWardId}
            onBack={() => setPage('wards')}
            onNavigate={handleNavigate}
          />
        );
      case 'health-score':
        return <HealthScorePage />;
      case 'ai-insights':
        return <AIInsightsPage onNavigate={handleNavigate} />;
      case 'map':
        return <MapWardsPage onNavigate={handleNavigate} />;
      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;
      case 'survey-responses':
        return <SurveyResponsesPage />;
    }
  };

  return (
    <AdminLayout active={page} onNavigate={handleNavigate} unreadCount={unreadCount} onLogout={onLogout}>
      {renderPage()}
    </AdminLayout>
  );
}
