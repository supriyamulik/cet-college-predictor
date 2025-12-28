import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Target, FileCheck, MessageSquare, Scale, BookOpen, GraduationCap,
  ArrowRight, X, Sparkles, Shield, Users, Award, Star,
  LogOut, User, AlertCircle, Zap
} from 'lucide-react';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [profileCreated, setProfileCreated] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(100);
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const createUserProfile = async () => {
      if (!user || profileCreated) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || 'Student',
            email: user.email,
            phone: '',
            createdAt: new Date().toISOString(),
            role: 'student'
          });
        }
        setProfileCreated(true);
      } catch (error) {
        console.error('Error creating profile:', error);
      }
    };

    createUserProfile();
  }, [user, profileCreated]);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    
    if (!profile) {
      setShowProfileBanner(true);
      setProfileCompletion(0);
      return;
    }

    const userData = JSON.parse(profile);
    
    if (!userData.onboardingComplete) {
      setShowProfileBanner(true);
      
      const fields = [
        userData.fullName,
        userData.gender,
        userData.dateOfBirth,
        userData.phone,
        userData.cetRank,
        userData.cetPercentile,
        userData.category,
        userData.preferredCities?.length > 0,
        userData.preferredBranches?.length > 0
      ];
      
      const completed = fields.filter(Boolean).length;
      setProfileCompletion(Math.round((completed / fields.length) * 100));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl animate-pulse delay-500" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                background: i % 3 === 0 ? '#FF9F1C' : '#8c52ff',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/logo.png" 
                alt="CET Insights" 
                className="h-20 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.svg';
                }}
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Profile</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome to CETInsights !
              </h1>
              <p className="text-gray-600 text-lg">
                Access all tools for your college admission journey
              </p>
            </div>
          </div>

          {/* Profile Completion Banner */}
          {showProfileBanner && profileCompletion < 100 && (
            <div className="bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <AlertCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      Complete Your Profile
                    </h3>
                    <p className="text-blue-100 mb-3">
                      Complete your profile to get personalized college recommendations.
                    </p>
                    <div className="w-full bg-white/30 rounded-full h-2 mb-3">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
                    >
                      Complete Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileBanner(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 px-6 py-2 rounded-full mb-4">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">6 Core Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Admissions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Access all tools to make informed decisions about your engineering college admissions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => navigate(module.path)}
                  className="bg-white/90 border-2 border-gray-200 rounded-2xl p-6 text-left hover:shadow-xl hover:border-blue-300 transition-all duration-300 group hover:scale-105"
                >
                  <div className={`mb-6 p-4 bg-gradient-to-br ${module.gradient} text-white rounded-2xl inline-block group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                    <module.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="mt-4 text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Access Feature
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/90 border-2 border-gray-200 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{profileCompletion}%</div>
                <div className="text-sm text-gray-600">Profile Complete</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Predictions Made</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Forms Created</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Colleges Saved</div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="font-medium">100% Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium">10,000+ Students</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="font-medium">95% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">4.8/5 Rating</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white mt-16 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            © 2025 CETInsights. Made with ❤️ for engineering aspirants
          </p>
        </div>
      </footer>
    </div>
  );
}

const modules = [
  {
    id: 'predictor',
    icon: Target,
    title: 'SmartPredict',
    description: 'AI-powered college predictions with 95% accuracy',
    gradient: 'from-blue-500 to-indigo-500',
    path: '/predictor'
  },
  {
    id: 'builder',
    icon: FileCheck,
    title: 'Option Form Builder',
    description: 'Intelligent option form builder with recommendations',
    gradient: 'from-indigo-500 to-purple-500',
    path: '/builder'
  },
  {
    id: 'assistant',
    icon: MessageSquare,
    title: 'AdmitAssist AI',
    description: '24/7 chatbot support for admission queries',
    gradient: 'from-purple-500 to-pink-500',
    path: '/assistant'
  },
  {
    id: 'compare',
    icon: Scale,
    title: 'CollegeCompare',
    description: 'Compare institutions side-by-side',
    gradient: 'from-pink-500 to-rose-500',
    path: '/compare'
  },
  {
    id: 'resources',
    icon: BookOpen,
    title: 'ResourceVault',
    description: 'Access study materials and guidance',
    gradient: 'from-orange-500 to-amber-500',
    path: '/resources'
  },
  {
    id: 'college-directory',
    icon: GraduationCap,
    title: 'CampusFinder',
    description: 'Complete college encyclopedia database',
    gradient: 'from-green-500 to-emerald-500',
    path: '/college-directory'
  }
];