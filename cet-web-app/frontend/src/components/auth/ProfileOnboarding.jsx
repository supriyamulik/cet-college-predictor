import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, CheckCircle
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

  // Form change handlers
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleArrayField = (field, value) =>
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter(v => v !== value)
        : [...(prev[field] || []), value]
    }));

  // Step navigation
  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 4));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  // Profile completion %
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

  // Complete onboarding
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

  // Render each step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">Personal Details</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <div className="flex gap-3">
              {['Male', 'Female', 'Other'].map(g => (
                <button
                  key={g}
                  onClick={() => handleChange('gender', g)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                    formData.gender === g ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
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
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">CET Details</h2>
            <input
              type="number"
              placeholder="CET Rank"
              value={formData.cetRank}
              onChange={e => handleChange('cetRank', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="CET Percentile"
              value={formData.cetPercentile}
              onChange={e => handleChange('cetPercentile', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleChange('category', cat)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                    formData.category === cat ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">Preferred Cities</h2>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border p-3 rounded-xl">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => toggleArrayField('preferredCities', city)}
                  className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                    formData.preferredCities.includes(city) ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={formData.needsHostel}
                onChange={e => handleChange('needsHostel', e.target.checked)}
                className="w-5 h-5"
              />
              Needs Hostel
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">Preferred Branches</h2>
            <div className="max-h-64 overflow-y-auto border p-3 rounded-xl space-y-2">
              {BRANCHES.map(branch => (
                <button
                  key={branch}
                  onClick={() => toggleArrayField('preferredBranches', branch)}
                  className={`w-full px-4 py-2 text-left rounded-lg transition-colors duration-200 ${
                    formData.preferredBranches.includes(branch) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl">
        {/* Progress */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-700">Complete Profile</h1>
          <span className="font-medium text-gray-600">{calculateCompletion()}% Complete</span>
        </div>
        <div className="flex gap-2 mb-6">
          {[1,2,3,4].map(s => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors duration-200 ${s <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {/* Form */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex mt-6 gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 border rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4 inline" /> Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={completeOnboarding}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}