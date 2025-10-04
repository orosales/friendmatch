import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import { Toaster } from './components/ui/toaster';

// Pages
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import InvitesPage from './pages/InvitesPage';
import CreateInvitePage from './pages/CreateInvitePage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            user ? (
              user.interests.length === 0 ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              user.interests.length > 0 ? (
                <DashboardPage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/matches"
          element={
            user ? (
              user.interests.length > 0 ? (
                <MatchesPage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/invites"
          element={
            user ? (
              user.interests.length > 0 ? (
                <InvitesPage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/invites/create"
          element={
            user ? (
              user.interests.length > 0 ? (
                <CreateInvitePage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              user.interests.length > 0 ? (
                <ProfilePage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
