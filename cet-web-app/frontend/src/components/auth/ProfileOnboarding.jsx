import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, CheckCircle, User, BookOpen, MapPin, GraduationCap
} from 'lucide-react';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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

export default function ProfileOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    phone: '',
    email: '',
    cetRank: '',
    cetPercentile: '',
    category: 'OPEN',
    preferredCities: [],
    preferredBranches: [],
    needsHostel: false,
    profileComplete: false,
    onboardingComplete: false,
    createdAt: null,
    lastUpdated: null
  });

  // Load user profile safely
  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.currentUser) return;
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: data.fullName || '',
            gender: data.gender || 'Male',
            dateOfBirth: data.dateOfBirth || '',
            phone: data.phone || '',
            email: data.email || auth.currentUser.email || '',
            cetRank: data.cetRank || '',
            cetPercentile: data.cetPercentile || '',
            category: data.category || 'OPEN',
            preferredCities: data.preferredCities || [],
            preferredBranches: data.preferredBranches || [],
            needsHostel: data.needsHostel || false,
            profileComplete: data.profileComplete || false,
            onboardingComplete: data.onboardingComplete || false,
            createdAt: data.createdAt || null,
            lastUpdated: data.lastUpdated || null
          });

          if (data.onboardingComplete) {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setFormData(prev => ({
            ...prev,
            email: auth.currentUser.email || ''
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const toggleArrayField = (field, value) =>
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter(v => v !== value)
        : [...(prev[field] || []), value]
    }));

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 4));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const calculateCompletion = () => {
    const fields = [
      formData.fullName,
      formData.gender,
      formData.dateOfBirth,
      formData.phone,
      formData.cetRank,
      formData.cetPercentile,
      formData.category,
      formData.preferredCities?.length || 0,
      formData.preferredBranches?.length || 0
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const completeOnboarding = async () => {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const updatedData = {
      ...formData,
      onboardingComplete: true,
      profileComplete: calculateCompletion() === 100,
      lastUpdated: new Date().toISOString(),
      createdAt: formData.createdAt || serverTimestamp()
    };
    try {
      await setDoc(userDocRef, updatedData, { merge: true });
      setFormData(updatedData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const renderStep = () => {
    const stepIcons = {
      1: { icon: <User className="w-6 h-6" />, title: 'Personal Details' },
      2: { icon: <BookOpen className="w-6 h-6" />, title: 'CET Details' },
      3: { icon: <MapPin className="w-6 h-6" />, title: 'Preferred Cities' },
      4: { icon: <GraduationCap className="w-6 h-6" />, title: 'Preferred Branches' }
    };

    const stepStyle = currentStep === 1 ? 'border-dashed' : 
                     currentStep === 2 ? 'border-dotted' : 
                     currentStep === 3 ? 'border-double' : 
                     'border-solid';

    const borderColor = currentStep === 1 ? 'border-blue-400' : 
                       currentStep === 2 ? 'border-green-400' : 
                       currentStep === 3 ? 'border-purple-400' : 
                       'border-indigo-400';

    const bgColor = currentStep === 1 ? 'bg-blue-50' : 
                   currentStep === 2 ? 'bg-green-50' : 
                   currentStep === 3 ? 'bg-purple-50' : 
                   'bg-indigo-50';

    switch (currentStep) {
      case 1:
        return (
          <div className={`p-6 rounded-2xl ${bgColor} ${stepStyle} ${borderColor} border-2`}>
            <div className="flex items-center gap-3 mb-6">
              {stepIcons[1].icon}
              <h2 className="text-2xl font-bold text-gray-800">{stepIcons[1].title}</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <div className="flex gap-3">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleChange('gender', g)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      formData.gender === g 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => handleChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className={`p-6 rounded-2xl ${bgColor} ${stepStyle} ${borderColor} border-2`}>
            <div className="flex items-center gap-3 mb-6">
              {stepIcons[2].icon}
              <h2 className="text-2xl font-bold text-gray-800">{stepIcons[2].title}</h2>
            </div>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="CET Rank"
                value={formData.cetRank}
                onChange={e => handleChange('cetRank', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
              <input
                type="number"
                placeholder="CET Percentile"
                value={formData.cetPercentile}
                onChange={e => handleChange('cetPercentile', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleChange('category', cat)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        formData.category === cat 
                          ? 'bg-green-600 text-white shadow-md' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={`p-6 rounded-2xl ${bgColor} ${stepStyle} ${borderColor} border-2`}>
            <div className="flex items-center gap-3 mb-6">
              {stepIcons[3].icon}
              <h2 className="text-2xl font-bold text-gray-800">{stepIcons[3].title}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Preferred Cities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-300 p-4 rounded-xl bg-white">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => toggleArrayField('preferredCities', city)}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                        formData.preferredCities.includes(city) 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.needsHostel}
                  onChange={e => handleChange('needsHostel', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <span className="font-medium text-gray-700">I need hostel accommodation</span>
              </label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={`p-6 rounded-2xl ${bgColor} ${stepStyle} ${borderColor} border-2`}>
            <div className="flex items-center gap-3 mb-6">
              {stepIcons[4].icon}
              <h2 className="text-2xl font-bold text-gray-800">{stepIcons[4].title}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Preferred Branches</label>
                <div className="max-h-64 overflow-y-auto border border-gray-300 p-4 rounded-xl bg-white space-y-2">
                  {BRANCHES.map(branch => (
                    <button
                      key={branch}
                      onClick={() => toggleArrayField('preferredBranches', branch)}
                      className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        formData.preferredBranches.includes(branch) 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
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
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Help us personalize your college predictions</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
              <span className="text-sm font-bold text-blue-600">{calculateCompletion()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                    step === currentStep 
                      ? 'bg-blue-600 text-white shadow-lg transform scale-110' 
                      : step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${
                    step === currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Step {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Step */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={completeOnboarding}
                className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Profile
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Your data is securely stored and will be used only for college predictions
        </div>
      </div>
    </div>
  );
}