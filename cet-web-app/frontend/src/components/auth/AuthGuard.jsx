import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';

export default function AuthGuard({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loading CETInsights...
          </h2>
          <p className="text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}