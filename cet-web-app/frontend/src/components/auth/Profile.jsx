import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Edit, Mail, Phone, Calendar, Award,
  Check, X, User, Shield, LogOut
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
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Celebration Background */}
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

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-4xl text-white">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  '👤'
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{formData.fullName || 'Your Name'}</h1>
                    <p className="text-gray-600 mb-4">{formData.email}</p>
                    <div className="flex flex-wrap gap-3">
                      {formData.cetRank && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          Rank: {formData.cetRank}
                        </span>
                      )}
                      {formData.cetPercentile && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                          Percentile: {formData.cetPercentile}%
                        </span>
                      )}
                      {formData.category && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                          {formData.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 ${
                      isEditing 
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                        : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isEditing ? <X size={18} /> : <Edit size={18} />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {[
                  { id: 'personal', label: 'Personal Info', icon: User },
                  { id: 'academic', label: 'Academic', icon: Award },
                  { id: 'preferences', label: 'Preferences', icon: Shield }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* Personal Info */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => handleChange('fullName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="+91 1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={e => handleChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="flex gap-2">
                        {['Male', 'Female', 'Other'].map(g => (
                          <button
                            key={g}
                            onClick={() => isEditing && handleChange('gender', g)}
                            disabled={!isEditing}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                              formData.gender === g
                                ? 'bg-blue-600 text-white'
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

              {/* Academic */}
              {activeTab === 'academic' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Academic Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CET Rank</label>
                      <input
                        type="number"
                        value={formData.cetRank}
                        onChange={e => handleChange('cetRank', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Enter your CET rank"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CET Percentile</label>
                      <input
                        type="number"
                        value={formData.cetPercentile}
                        onChange={e => handleChange('cetPercentile', e.target.value)}
                        disabled={!isEditing}
                        step="0.01"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Enter percentile (e.g., 98.5)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => isEditing && handleChange('category', cat)}
                            disabled={!isEditing}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              formData.category === cat
                                ? 'bg-green-600 text-white'
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

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">College Preferences</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Cities ({formData.preferredCities?.length || 0} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {CITIES.map(city => (
                          <button
                            key={city}
                            onClick={() => isEditing && toggleArrayField('preferredCities', city)}
                            disabled={!isEditing}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              formData.preferredCities?.includes(city)
                                ? 'bg-purple-600 text-white'
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Branches ({formData.preferredBranches?.length || 0} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                      {BRANCHES.map(branch => (
                        <button
                          key={branch}
                          onClick={() => isEditing && toggleArrayField('preferredBranches', branch)}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors ${
                            formData.preferredBranches?.includes(branch)
                              ? 'bg-blue-600 text-white'
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
            <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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

      <style>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}