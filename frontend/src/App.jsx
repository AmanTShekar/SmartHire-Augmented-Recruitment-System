import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import CandidateLayout from './Layout/CandidateLayout';
import CompanyLayout from './Layout/CompanyLayout';
import AdminLayout from './Layout/AdminLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import InterviewHUD from './pages/InterviewHUD';
import Documentation from './pages/Documentation';
import SystemRedirect from './pages/SystemRedirect';

// Candidate pages
import ProfilePage from './pages/candidate/ProfilePage';
import LiveProfile from './pages/candidate/LiveProfile';
import SmartFeed from './pages/candidate/SmartFeed';
import JobBrowsePage from './pages/candidate/JobBrowsePage';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';
import TestTakingPage from './pages/candidate/TestTakingPage';
import AIInterviewRoom from './pages/candidate/AIInterviewRoom';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import TalentWarRoom from './pages/company/TalentWarRoom';
import JobArchitect from './pages/company/JobArchitect';
import HiringCampaignPage from './pages/company/HiringCampaignPage';
import CandidateReviewPage from './pages/company/CandidateReviewPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSystemPage from './pages/admin/AdminSystemPage';

import './index.css';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to role-appropriate page
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'company') return <Navigate to="/company" replace />;
    return <Navigate to="/candidate" replace />;
  }

  return children;
};

// Smart redirect from /dashboard based on role
const DashboardRedirect = () => {
  const { role, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'company') return <Navigate to="/company" replace />;
  return <Navigate to="/candidate" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/interview-hud" element={<InterviewHUD />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/redirect" element={<SystemRedirect />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Candidate Portal */}
          <Route element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateLayout />
            </ProtectedRoute>
          }>
            <Route path="/candidate" element={<ProfilePage />} />
            <Route path="/candidate/nexus" element={<LiveProfile />} />
            <Route path="/candidate/feed" element={<SmartFeed />} />
            <Route path="/candidate/jobs" element={<JobBrowsePage />} />
            <Route path="/candidate/applications" element={<MyApplicationsPage />} />
            <Route path="/candidate/test/:roundId" element={<TestTakingPage />} />
            <Route path="/candidate/interview/:sessionId" element={<AIInterviewRoom />} />
          </Route>

          {/* Company Portal */}
          <Route element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyLayout />
            </ProtectedRoute>
          }>
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/war-room" element={<TalentWarRoom />} />
            <Route path="/company/architect" element={<JobArchitect />} />
            <Route path="/company/campaigns" element={<HiringCampaignPage />} />
            <Route path="/company/review" element={<CandidateReviewPage />} />
          </Route>

          {/* Admin Portal */}
          <Route element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/system" element={<AdminSystemPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
