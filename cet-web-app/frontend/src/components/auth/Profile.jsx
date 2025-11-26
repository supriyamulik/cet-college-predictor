import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase'; // Only auth for user info
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { 
  Home, Search, FileText, BarChart3, User, LogOut, Bell,
  Settings, ChevronDown, ArrowLeft, Save, Edit, Mail,
  Phone, GraduationCap, Target, GitCompare, Sparkles
} from 'lucide-react';

// Sidebar Component
function Sidebar() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('profile');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'predictor', icon: Search, label: 'College Predictor', path: '/predictor' },
    { id: 'optionform', icon: FileText, label: 'Option Form Builder', path: '/builder' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'compare', icon: GitCompare, label: 'Compare Colleges', path: '/compare' },
    { id: 'colleges', icon: GraduationCap, label: 'Colleges', path: '/colleges' },
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

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institute: '',
    cetScore: '',
    cetRank: '',
    category: 'General',
    gender: 'Male'
  });
  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`cetProfile_${user.uid}`);
      
      if (savedProfile) {
        // Load saved profile data
        const userData = JSON.parse(savedProfile);
        setFormData(userData);
      } else {
        // Initialize with user data from auth
        setFormData({
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          institute: '',
          cetScore: '',
          cetRank: '',
          category: 'General',
          gender: 'Male'
        });
      }
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      // Save to localStorage with user-specific key
      localStorage.setItem(`cetProfile_${user.uid}`, JSON.stringify(formData));
      toast.success('Profile updated successfully! 🎉');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <div className="lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button for Mobile */}
          <button
            onClick={() => navigate('/dashboard')}
            className="lg:hidden mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  isEditing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center gap-6 pb-8 border-b border-gray-200 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {formData.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'User'}</h2>
                <p className="text-gray-600 mt-1">{formData.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.cetRank ? `CET Rank: ${formData.cetRank}` : 'Update your CET details'}
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="+91 1234567890"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Institute */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Institute</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="institute"
                    value={formData.institute}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your college/school"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* CET Score */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CET Score</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="cetScore"
                    value={formData.cetScore}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your score"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* CET Rank */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CET Rank</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="cetRank"
                    value={formData.cetRank}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your rank"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}