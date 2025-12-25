import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Search, FileText, BarChart3, User,
  ArrowLeft, Save, Edit, GraduationCap, GitCompare, Sparkles,
  Mail, Phone, Calendar, Award, MapPin, BookOpen,
  Check, X
} from 'lucide-react';
import { auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const BRANCHES = [
  'Computer Engineering', 'Information Technology', 'Electronics and Telecommunication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Artificial Intelligence and Data Science', 'Computer Science and Engineering (Data Science)',
  'Electronics and Computer Engineering', 'Instrumentation Engineering',
  'Chemical Engineering', 'Production Engineering', 'Automobile Engineering', 'Textile Engineering'
];

const CITIES = [
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Amravati', 'Kolhapur', 'Solapur',
  'Ahmednagar', 'Akola', 'Latur', 'Dhule', 'Jalgaon', 'Chandrapur', 'Parbhani', 'Nanded',
  'Satara', 'Ratnagiri', 'Sangli', 'Thane'
];

const CATEGORIES = ['OPEN', 'OBC', 'SC', 'ST', 'EWS'];

/* ---------------- SIDEBAR ---------------- */
function Sidebar({ activeItem, navigate }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'predictor', icon: Search, label: 'College Predictor', path: '/predictor' },
    { id: 'optionform', icon: FileText, label: 'Option Form Builder', path: '/builder' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'compare', icon: GitCompare, label: 'Compare Colleges', path: '/compare' },
    { id: 'colleges', icon: GraduationCap, label: 'Colleges', path: '/colleges' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-lg z-10">
      <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center px-6 mb-8">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3">
            🎓
          </div>
          <span className="text-xl font-bold text-blue-600">CETInsights</span>
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeItem === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
            <Sparkles className="w-6 h-6 mb-2" />
            <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
            <p className="text-xs opacity-90">Get advanced insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */
export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    cetRank: '',
    cetPercentile: '',
    category: 'OPEN',
    preferredCities: [],
    preferredBranches: []
  });

  /* ✅ LOAD PROFILE DATA FROM FIRESTORE */
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: data.fullName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            gender: data.gender || 'Male',
            dateOfBirth: data.dateOfBirth || '',
            cetRank: data.cetRank || '',
            cetPercentile: data.cetPercentile || '',
            category: data.category || 'OPEN',
            preferredCities: data.preferredCities || [],
            preferredBranches: data.preferredBranches || []
          });
        } else {
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        toast.error('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const toggleArrayField = (field, value) =>
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter(v => v !== value)
        : [...(prev[field] || []), value]
    }));

  /* ✅ SAVE PROFILE TO FIRESTORE */
  const handleSave = async () => {
    if (!user) return;
    
    // Validation
    if (!formData.fullName) {
      toast.error('Please enter your full name');
      return;
    }
    
    setIsSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { ...formData, lastUpdated: new Date().toISOString() }, { merge: true });
      toast.success('Profile updated successfully! 🎉');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar activeItem="profile" navigate={navigate} />

      <div className="lg:ml-64 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="lg:hidden mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
              <div className="absolute -bottom-16 left-8 flex items-end gap-4">
                <div className="w-32 h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center text-5xl border-4 border-white">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="pb-4 text-white">
                  <h1 className="text-2xl font-bold mb-1">{formData.fullName || 'Your Name'}</h1>
                  <p className="text-blue-100 text-sm">{formData.email}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-20 px-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-6">
                {formData.cetRank && (
                  <div>
                    <p className="text-sm text-gray-500">CET Rank</p>
                    <p className="text-xl font-bold text-blue-600">{formData.cetRank}</p>
                  </div>
                )}
                {formData.cetPercentile && (
                  <div>
                    <p className="text-sm text-gray-500">Percentile</p>
                    <p className="text-xl font-bold text-indigo-600">{formData.cetPercentile}%</p>
                  </div>
                )}
                {formData.category && (
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="text-xl font-bold text-purple-600">{formData.category}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                }`}
              >
                {isEditing ? <X size={18} /> : <Edit size={18} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-t-2xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'academic', label: 'Academic', icon: Award },
                { id: 'preferences', label: 'Preferences', icon: BookOpen }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={e => handleChange('fullName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => handleChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => handleChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                          placeholder="+91 1234567890"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={e => handleChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="flex gap-2">
                        {['Male', 'Female', 'Other'].map(g => (
                          <button
                            key={g}
                            onClick={() => isEditing && handleChange('gender', g)}
                            disabled={!isEditing}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                              formData.gender === g
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Tab */}
              {activeTab === 'academic' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Academic Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CET Rank</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                          type="number"
                          value={formData.cetRank}
                          onChange={e => handleChange('cetRank', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                          placeholder="Enter your CET rank"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CET Percentile</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                          type="number"
                          value={formData.cetPercentile}
                          onChange={e => handleChange('cetPercentile', e.target.value)}
                          disabled={!isEditing}
                          step="0.01"
                          max="100"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                          placeholder="Enter percentile (e.g., 98.5)"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => isEditing && handleChange('category', cat)}
                            disabled={!isEditing}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${
                              formData.category === cat
                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">College Preferences</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Cities ({formData.preferredCities?.length || 0} selected)
                    </label>
                    <div className="border border-gray-300 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {CITIES.map(city => (
                          <button
                            key={city}
                            onClick={() => isEditing && toggleArrayField('preferredCities', city)}
                            disabled={!isEditing}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                              formData.preferredCities?.includes(city)
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                          >
                            {formData.preferredCities?.includes(city) && <Check size={14} className="inline mr-1" />}
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Branches ({formData.preferredBranches?.length || 0} selected)
                    </label>
                    <div className="border border-gray-300 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2">
                      {BRANCHES.map(branch => (
                        <button
                          key={branch}
                          onClick={() => isEditing && toggleArrayField('preferredBranches', branch)}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-all ${
                            formData.preferredBranches?.includes(branch)
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                        >
                          {formData.preferredBranches?.includes(branch) && <Check size={16} className="inline mr-2" />}
                          {branch}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="bg-white rounded-b-2xl shadow-xl px-8 py-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}