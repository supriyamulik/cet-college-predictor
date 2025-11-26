import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import AuthGuard from './components/auth/AuthGuard';
import GuideSteps from './components/optionform/GuideSteps';
import OptionFormBuilder from './components/optionform/OptionFormBuilder';
import Profile from './components/auth/Profile'; // Add this

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/predictor" element={<AuthGuard><Predictor /></AuthGuard>} />
          
          {/* Option Form Routes */}
          <Route path="/builder" element={<AuthGuard><OptionFormBuilder /></AuthGuard>} />
          <Route path="/builder/guide" element={<AuthGuard><GuideSteps /></AuthGuard>} />
          <Route path="/builder/form" element={<AuthGuard><OptionFormBuilder /></AuthGuard>} />
          
          {/* Profile Route */}
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}