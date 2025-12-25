import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';

// Context Provider
import { ComparisonProvider } from './context/ComparisonContext';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import CompareColleges from './pages/CompareColleges';
import CollegeDirectory from './pages/CollegeDirectory';

// Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/auth/Profile';
import ProfileOnboarding from './components/auth/ProfileOnboarding';
import OptionFormBuilder from './components/optionform/OptionFormBuilder';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ComparisonProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/dashboard" replace />}
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={user ? <ProfileOnboarding /> : <Navigate to="/login" replace />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/predictor"
            element={user ? <Predictor /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/builder"
            element={user ? <OptionFormBuilder /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/compare"
            element={user ? <CompareColleges /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/college-directory"
            element={user ? <CollegeDirectory /> : <Navigate to="/login" replace />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ComparisonProvider>
    </Router>
  );
}

export default App;