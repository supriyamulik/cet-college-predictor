import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Home, Search, FileText, BarChart3, User, LogOut, Bell,
  Settings, ChevronDown, Target, BookOpen, TrendingUp,
  Award, Calendar, GitCompare, GraduationCap, Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [profileCreated, setProfileCreated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const createUserProfile = async () => {
      if (!user || profileCreated) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || 'Anonymous',
            email: user.email,
            phone: '',
            createdAt: new Date().toISOString(),
            role: 'student'
          });
          console.log('✅ User profile created');
        }
        setProfileCreated(true);
      } catch (error) {
        console.error('Error creating profile:', error);
      }
    };

    createUserProfile();
  }, [user, profileCreated]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 rounded-xl hover:bg-white/80 relative transition-all duration-300 group shadow-sm border border-gray-200/50"
                  >
                    <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-5 animate-in">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="font-medium text-gray-900 text-sm">New cutoffs released</p>
                          <p className="text-gray-600 text-sm mt-1">2025 cutoffs are now available</p>
                          <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/80 transition-all duration-300 border border-gray-200/50 shadow-sm group"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {user?.displayName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {user?.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 animate-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.displayName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        View Profile
                      </button>
                      <button
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-indigo-600" />
                        Settings
                      </button>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          <DashboardHome user={user} navigate={navigate} />
        </main>
      </div>

      <style>{`
        .animate-in {
          animation: slideIn 0.2s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Sidebar Component
function Sidebar() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'predictor', icon: Search, label: 'College Predictor', path: '/predictor' },
    { id: 'optionform', icon: FileText, label: 'Option Form Builder', path: '/builder' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'compare', icon: GitCompare, label: 'Compare Colleges', path: '/compare' },
    { id: 'colleges', icon: GraduationCap, label: 'Colleges', path: '/directory' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-4 py-3 flex items-center justify-between shadow-sm">
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🎓 CETInsights
        </span>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-lg">
        <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center px-6 mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg">
              🎓
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CETInsights
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  activeItem === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  activeItem === item.id ? 'text-white' : 'text-gray-500'
                }`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="px-3 pb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 text-white">
              <Sparkles className="w-6 h-6 mb-2" />
              <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
              <p className="text-xs text-blue-100 mb-3">Get unlimited predictions</p>
              <button className="w-full bg-white text-blue-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 px-2 py-2 z-50 shadow-lg">
        <div className="flex items-center justify-around">
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                navigate(item.path);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                activeItem === item.id 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Dashboard Home Content
// Dashboard Home Content
function DashboardHome({ user, navigate }) {
  const modules = [
    {
      id: 'predictor',
      icon: Search,
      title: 'College Predictor',
      description: 'Get AI-powered college predictions based on your CET rank',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      path: '/predictor'
    },
    {
      id: 'builder',
      icon: FileText,
      title: 'Option Form Builder',
      description: 'Create and organize your college preference list',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      path: '/builder'
    },
    {
      id: 'college-directory', // Changed from 'colleges'
      icon: GraduationCap,
      title: 'College Directory',
      description: 'Browse and add colleges from complete directory',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      path: '/directory' // Changed to your college directory route
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics',
      description: 'View admission trends and cutoff statistics',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      path: '/analytics'
    },
    {
      id: 'compare',
      icon: GitCompare,
      title: 'Compare Colleges',
      description: 'Compare colleges side-by-side to make better decisions',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      path: '/compare'
    },
    {
      id: 'resources',
      icon: BookOpen,
      title: 'Resources',
      description: 'Access guides, tips and admission resources',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      path: '/resources'
    }
  ];

  const stats = [
    { label: 'Predictions Made', value: '0', icon: Target, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Saved Colleges', value: '0', icon: Award, color: 'green', gradient: 'from-green-500 to-green-600' },
    { label: 'Options Filled', value: '0/150', icon: FileText, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
    { label: 'Last Updated', value: 'Today', icon: Calendar, color: 'orange', gradient: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-8">
      {/* Quick Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => (
            <button
              key={module.id}
              onClick={() => navigate(module.path)}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 text-left hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <module.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {module.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Get Started 
                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Account Created</p>
              <p className="text-xs text-gray-600 mt-1">Welcome to CET Predictor! Start exploring your college options.</p>
            </div>
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Today</span>
          </div>
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">Start by making your first college prediction</p>
            <button 
              onClick={() => navigate('/predictor')}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}