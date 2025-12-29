// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../../config/firebase';

// export default function AuthGuard({ children }) {
//   const [user, loading] = useAuthState(auth);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             Loading CETInsights...
//           </h2>
//           <p className="text-gray-600 mt-2">Please wait</p>
//         </div>
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/login" />;
// }
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import { Shield, Lock, CheckCircle, Cpu, Brain, Zap } from 'lucide-react';

export default function AuthGuard({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          {/* Gradient Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-50/80" />
          
          {/* Animated Orbs */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full filter blur-3xl animate-pulse animate-orb-float" />
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl animate-pulse animate-orb-float-slow delay-1000" />
            <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full filter blur-3xl animate-pulse animate-orb-float delay-500" />
          </div>
          
          {/* Circuit Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0,40 L80,40 M40,0 L40,80" stroke="currentColor" strokeWidth="1" fill="none" />
                  <circle cx="40" cy="40" r="4" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-particle-float"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  background: `radial-gradient(circle, ${i % 3 === 0 ? '#4F46E5' : i % 3 === 1 ? '#7C3AED' : '#2563EB'}, transparent)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                               linear-gradient(to bottom, #888 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }} />
          </div>
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          {/* Security Shield Container */}
          <div className="relative mb-10">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl animate-pulse"></div>
            
            {/* Animated Rings */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 border-4 border-blue-300 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-4 border-4 border-purple-300 rounded-full animate-ping opacity-20 delay-300"></div>
              <div className="absolute inset-8 border-4 border-indigo-300 rounded-full animate-ping opacity-20 delay-700"></div>
            </div>
            
            {/* Main Shield */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-200/50">
              {/* Shield Icon with Animation */}
              <div className="relative">
                <Shield className="w-16 h-16 text-blue-600 animate-pulse" />
                <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-bounce-slow" />
              </div>
              
              {/* Rotating Security Dots */}
              <div className="absolute -top-2 -right-2">
                <div className="relative w-8 h-8">
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-orbit"></div>
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2">
                <div className="relative w-8 h-8">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full animate-orbit-reverse delay-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Content */}
          <div className="text-center max-w-2xl mx-auto">
            {/* Animated Title */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-text">
                CETInsights
              </h1>
              <div className="inline-block">
                <span className="text-lg font-medium text-gray-600 relative">
                  Securing Your Dashboard
                  <span className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-blue-500 animate-pulse"></span>
                </span>
              </div>
            </div>

            {/* Loading Indicators */}
            <div className="flex flex-col items-center gap-6 mb-10">
              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Authentication Progress</span>
                  <span className="text-sm font-bold text-blue-600 animate-pulse">Verifying...</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress-bar"></div>
                </div>
              </div>

              {/* Security Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                {[
                  { icon: Shield, label: 'Security Check', color: 'blue' },
                  { icon: CheckCircle, label: 'Session Valid', color: 'green' },
                  { icon: Brain, label: 'Loading Data', color: 'purple' }
                ].map((step, index) => (
                  <div
                    key={step.label}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 transition-all duration-300 ${
                      index === 0 ? 'animate-pulse' : 'opacity-70'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-${step.color}-100`}>
                      <step.icon className={`w-5 h-5 text-${step.color}-600`} />
                    </div>
                    <span className="font-medium text-gray-700">{step.label}</span>
                    {index === 0 && (
                      <div className="ml-auto w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Loading Animation */}
            <div className="flex flex-col items-center gap-4">
              {/* Rotating Spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full animate-spin animation-delay-500"></div>
                <div className="absolute inset-4 border-4 border-indigo-500 border-l-transparent rounded-full animate-spin animation-delay-1000"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Loading Text with Animation */}
              <div className="flex flex-col items-center">
                <p className="text-gray-600 font-medium mb-2 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Preparing your personalized dashboard
                </p>
                <p className="text-sm text-gray-500 animate-pulse">
                  This will only take a moment...
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80">
              {[
                { icon: Cpu, label: 'AI Predictions', color: 'blue' },
                { icon: Zap, label: 'Fast Analysis', color: 'yellow' },
                { icon: Shield, label: 'Secure Data', color: 'green' },
                { icon: Brain, label: 'Smart Insights', color: 'purple' }
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col items-center p-3 rounded-lg bg-white/40 backdrop-blur-sm border border-gray-200/30 hover:border-blue-200 transition-all duration-300 hover:scale-105"
                >
                  <div className={`p-2 rounded-full bg-${feature.color}-100 mb-2`}>
                    <feature.icon className={`w-5 h-5 text-${feature.color}-600`} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-10 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-200/30 backdrop-blur-sm max-w-lg mx-auto">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-semibold text-blue-600">Tip:</span> Make sure you have a stable internet connection for the best experience
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pb-8 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            <p>© {new Date().getFullYear()} CETInsights. All rights reserved.</p>
            <p className="flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Secure SSL Connection • Your data is encrypted
            </p>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes gradient-text {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes orb-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          @keyframes orb-float-slow {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.1); }
          }

          @keyframes particle-float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(10px, -20px) rotate(120deg); }
            66% { transform: translate(-10px, -10px) rotate(240deg); }
          }

          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
          }

          @keyframes orbit-reverse {
            0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
            100% { transform: rotate(-360deg) translateX(12px) rotate(360deg); }
          }

          @keyframes progress-bar {
            0% { width: 0%; opacity: 0.6; }
            50% { width: 60%; opacity: 1; }
            100% { width: 100%; opacity: 0.6; }
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
          }

          .animate-gradient-text {
            background-size: 200% auto;
            animation: gradient-text 3s ease infinite;
          }

          .animate-orb-float {
            animation: orb-float 8s ease-in-out infinite;
          }

          .animate-orb-float-slow {
            animation: orb-float-slow 10s ease-in-out infinite;
          }

          .animate-particle-float {
            animation: particle-float 6s ease-in-out infinite;
          }

          .animate-orbit {
            animation: orbit 3s linear infinite;
          }

          .animate-orbit-reverse {
            animation: orbit-reverse 3s linear infinite;
          }

          .animate-progress-bar {
            animation: progress-bar 2s ease-in-out infinite;
          }

          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }

          .animation-delay-500 {
            animation-delay: 500ms;
          }

          .animation-delay-1000 {
            animation-delay: 1000ms;
          }

          /* Custom scrollbar styling for any overflow */
          .overflow-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .overflow-hidden::-webkit-scrollbar {
            display: none;
          }

          /* Smooth transitions for all elements */
          * {
            transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
          }
        `}</style>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}