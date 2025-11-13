import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Home, Search, FileText, BarChart3, User, LogOut, Bell, 
  TrendingUp, Award, BookOpen, Calendar, Target, Zap,
  ChevronRight, Plus, Download, Settings
} from 'lucide-react';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [profileCreated, setProfileCreated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Create user profile in background
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
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-gray-100 relative transition"
                  >
                    <Bell className="w-6 h-6 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
                      <h3 className="font-bold text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <NotificationItem 
                          title="New cutoffs released!"
                          message="2025 cutoffs are now available"
                          time="2 hours ago"
                        />
                        <NotificationItem 
                          title="Complete your profile"
                          message="Add your CET details to get predictions"
                          time="1 day ago"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.displayName?.charAt(0) || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && <HomeTab navigate={navigate} user={user} />}
          {activeTab === 'predictor' && <PredictorTab navigate={navigate} />}
          {activeTab === 'optionform' && <OptionFormTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'profile' && <ProfileTab user={user} />}
        </main>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', color: 'blue' },
    { id: 'predictor', icon: Search, label: 'College Predictor', color: 'indigo' },
    { id: 'optionform', icon: FileText, label: 'Option Form', color: 'purple' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'pink' },
    { id: 'profile', icon: User, label: 'Profile', color: 'green' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🎓 CETInsights
        </span>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🎓 CETInsights
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="px-3 mt-auto">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
        <div className="flex items-center justify-around">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Home Tab
function HomeTab({ navigate, user }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Search className="w-8 h-8" />}
          title="Predictions"
          value="0"
          gradient="from-blue-500 to-blue-600"
          description="College predictions made"
        />
        <StatCard
          icon={<FileText className="w-8 h-8" />}
          title="Option Form"
          value="0/150"
          gradient="from-indigo-500 to-indigo-600"
          description="Options filled"
        />
        <StatCard
          icon={<Award className="w-8 h-8" />}
          title="Saved Colleges"
          value="0"
          gradient="from-purple-500 to-purple-600"
          description="Colleges bookmarked"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Success Rate"
          value="--"
          gradient="from-pink-500 to-pink-600"
          description="Prediction accuracy"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionCard
          icon={<Search className="w-12 h-12" />}
          title="Start College Prediction"
          description="Get AI-powered predictions based on your CET rank and preferences"
          buttonText="Get Started"
          gradient="from-blue-500 to-indigo-600"
          onClick={() => navigate('/predictor')}
        />
        <QuickActionCard
          icon={<FileText className="w-12 h-12" />}
          title="Build Option Form"
          description="Create your optimized CAP option form with smart recommendations"
          buttonText="Build Form"
          gradient="from-purple-500 to-pink-600"
          onClick={() => navigate('/predictor')}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </button>
        </div>

        <div className="space-y-4">
          <ActivityItem
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            title="Account Created"
            description={`Welcome to CETInsights! Your journey starts now.`}
            time="Today"
          />
          <ActivityItem
            icon={<Target className="w-5 h-5 text-green-600" />}
            title="Complete Your Profile"
            description="Add your CET details to get accurate predictions"
            time="Pending"
            actionButton={
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Complete Now →
              </button>
            }
          />
        </div>
      </div>

      {/* Tips & Resources */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Pro Tip!</h3>
            <p className="text-blue-100 mb-4">
              Start with 10-15 dream colleges, 25-30 target colleges, and 15-20 safe colleges for the best results.
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Predictor Tab (Placeholder)
function PredictorTab({ navigate }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">College Predictor</h2>
        <p className="text-gray-600 mb-6">
          Enter your CET rank and preferences to get AI-powered college predictions
        </p>
        <button
          onClick={() => navigate('/predictor')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Start Prediction →
        </button>
      </div>
    </div>
  );
}

// Option Form Tab (Placeholder)
function OptionFormTab() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Option Form Builder</h2>
        <p className="text-gray-600 mb-6">
          Create and manage your college preference list for CAP rounds
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
          Create Option Form
        </button>
      </div>
    </div>
  );
}

// Analytics Tab (Placeholder)
function AnalyticsTab() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600 mb-6">
          View trends, cutoffs, and admission probability analytics
        </p>
        <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
          View Analytics
        </button>
      </div>
    </div>
  );
}

// Profile Tab
function ProfileTab({ user }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{user?.displayName || 'Anonymous'}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                Change Photo
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <InputField label="Full Name" value={user?.displayName || ''} />
            <InputField label="Email" value={user?.email || ''} disabled />
            <InputField label="Phone Number" placeholder="+91 1234567890" />
            <InputField label="CET Rank" placeholder="Enter your rank" />
            <InputField label="Percentile" placeholder="Enter your percentile" />
          </div>

          <div className="flex gap-4 pt-6">
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all">
              Save Changes
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function StatCard({ icon, title, value, gradient, description }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <ChevronRight className="w-5 h-5 opacity-50" />
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-xs opacity-75 mt-1">{description}</p>
    </div>
  );
}

function QuickActionCard({ icon, title, description, buttonText, gradient, onClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onClick}
        className={`w-full bg-gradient-to-r ${gradient} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all`}
      >
        {buttonText}
      </button>
    </div>
  );
}

function ActivityItem({ icon, title, description, time, actionButton }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        {actionButton && <div className="mt-2">{actionButton}</div>}
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
}

function NotificationItem({ title, message, time }) {
  return (
    <div className="p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          <p className="text-xs text-gray-600 mt-1">{message}</p>
          <span className="text-xs text-gray-500 mt-1">{time}</span>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}