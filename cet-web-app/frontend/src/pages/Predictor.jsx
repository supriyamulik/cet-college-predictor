import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Search, Plus, CheckCircle, Award, Target, Shield, 
  User, GraduationCap, List, AlertCircle, Edit
} from 'lucide-react';

const API_URL = 'http://localhost:5000';

export default function Predictor() {
  const [user, authLoading] = useAuthState(auth);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [optionForm, setOptionForm] = useState([]);
  const [addCategory, setAddCategory] = useState('HIGH');
  const [profileData, setProfileData] = useState(null);
  
  // Enhanced filter states
  const [showLadiesOnly, setShowLadiesOnly] = useState(false);
  const [showPWD, setShowPWD] = useState(false);
  const [showDefence, setShowDefence] = useState(false);

  // Ladies-only categories (from Python)
  const LADIES_ONLY_CATEGORIES = [
    'LOPENS', 'LOPENH',
    'LOBCS', 'LOBCO', 'LOBCH',
    'LSCS', 'LSCO', 'LSCH',
    'LSTS', 'LSTO', 'LSTH',
    'LRNT1S', 'LRNT1H',
    'LRNT2S', 'LRNT2H',
    'LRNT3S', 'LRNT3H',
    'LVJS', 'LVJH',
    'LEWSS', 'LEWSH'
  ];

  // Load profile data from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            rank: data.cetRank || '',
            percentile: data.cetPercentile || '',
            category: data.category || 'OPEN',
            gender: data.gender || '',
            preferredCities: data.preferredCities || [],
            branches: data.preferredBranches || []
          });

          if (!data.cetRank || !data.cetPercentile || !data.preferredBranches?.length) {
            toast.error('Please complete your profile to use the predictor', {
              duration: 4000,
              id: 'profile-incomplete'
            });
          }
        } else {
          toast.error('Profile not found. Please complete your profile first.');
          setTimeout(() => navigate('/profile'), 2000);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        toast.error('Failed to load profile data');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  // Load saved option form
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`userOptionForm_${user.uid}`);
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          setOptionForm(Array.isArray(parsedData) ? parsedData : []);
        } catch (e) {
          console.error('Error loading option form:', e);
          setOptionForm([]);
        }
      }
    }
  }, [user]);

  const handlePredict = async () => {
    if (!profileData?.rank || !profileData?.percentile) {
      toast.error('Please add your CET rank and percentile in your profile');
      setTimeout(() => navigate('/profile'), 1500);
      return;
    }

    if (!profileData?.branches || profileData.branches.length === 0) {
      toast.error('Please select preferred branches in your profile');
      setTimeout(() => navigate('/profile'), 1500);
      return;
    }

    if (!profileData?.gender) {
      toast.error('Please select your gender in your profile for accurate predictions');
      setTimeout(() => navigate('/profile'), 1500);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: parseInt(profileData.rank),
          percentile: parseFloat(profileData.percentile),
          category: profileData.category,
          gender: profileData.gender,
          city: profileData.preferredCities?.[0] || null,
          branches: profileData.branches
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.success && Array.isArray(result.predictions)) {
        setPredictions(result.predictions);
        setStep(2);
        toast.success(`Found ${result.predictions.length} colleges matching your profile!`);
      } else {
        toast.error('Error: ' + (result?.error || 'Unexpected response'));
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering with Ladies-only, PWD and Defence quota filters
  const filteredPredictions = predictions.filter(p => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      (p.college_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.branch || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Quota filter
    const quotaCategory = (p.quota_category || 'OPEN').toUpperCase();
    
    // Always show OPEN and general G-category seats
    if (quotaCategory === 'OPEN' || quotaCategory.startsWith('G')) {
      // But exclude ladies-only L-categories for males unless filter is on
      if (LADIES_ONLY_CATEGORIES.includes(quotaCategory)) {
        if (profileData?.gender === 'Male' || profileData?.gender === 'M') {
          return showLadiesOnly; // Males need checkbox to see ladies seats
        }
        return true; // Females always see ladies seats
      }
      return true;
    }
    
    // Show Ladies-only L-category seats based on filter
    if (LADIES_ONLY_CATEGORIES.includes(quotaCategory)) {
      if (profileData?.gender === 'Male' || profileData?.gender === 'M') {
        return showLadiesOnly; // Males need checkbox
      }
      return true; // Females always see
    }
    
    // Show PWD seats only if checkbox is checked
    if (quotaCategory.includes('PWD')) {
      return showPWD;
    }
    
    // Show Defence seats only if checkbox is checked
    if (quotaCategory.includes('DEF') || quotaCategory.includes('DEFENCE')) {
      return showDefence;
    }
    
    // For any other quota categories, show them by default
    return true;
  });

  const addToOptionForm = (college, category = addCategory) => {
    if (!optionForm.find(c => c.branch_code === college.branch_code)) {
      const newOptionForm = [...optionForm, { 
        ...college, 
        priority: optionForm.length + 1,
        user_category: category,
        added_at: new Date().toISOString()
      }];
      setOptionForm(newOptionForm);
      
      localStorage.setItem('currentOptionForm', JSON.stringify(newOptionForm));
      if (user) {
        localStorage.setItem(`userOptionForm_${user.uid}`, JSON.stringify(newOptionForm));
      }
      
      toast.success(`Added to ${getCategoryLabel(category)} Priority!`);
    } else {
      toast.error('Already in Option Form');
    }
  };

  const addAllToCategory = (colleges, category) => {
    const newColleges = colleges.filter(
      college => !optionForm.find(c => c.branch_code === college.branch_code)
    );
    
    if (newColleges.length === 0) {
      toast.error('All colleges from this category are already added');
      return;
    }

    const enhancedColleges = newColleges.map((college, index) => ({
      ...college,
      priority: optionForm.length + index + 1,
      user_category: category,
      added_at: new Date().toISOString()
    }));
    const newOptionForm = [...optionForm, ...enhancedColleges];
    setOptionForm(newOptionForm);
    
    localStorage.setItem('currentOptionForm', JSON.stringify(newOptionForm));
    if (user) {
      localStorage.setItem(`userOptionForm_${user.uid}`, JSON.stringify(newOptionForm));
    }
    
    toast.success(`Added ${newColleges.length} colleges to ${getCategoryLabel(category)} Priority`);
  };

  const getCategoryLabel = (category) => {
    const labels = { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };
    return labels[category] || category;
  };

  const navigateToOptionForm = () => {
    if (optionForm.length === 0) {
      toast.error('Please add some colleges to your option form first');
      return;
    }
    
    const dataToSave = JSON.stringify(optionForm);
    localStorage.setItem('currentOptionForm', dataToSave);
    if (user) {
      localStorage.setItem(`userOptionForm_${user.uid}`, dataToSave);
    }
    
    navigate('/builder');
  };

  const highChance = filteredPredictions.filter(p => p.category === 'HIGH');
  const moderateChance = filteredPredictions.filter(p => p.category === 'MODERATE');
  const backupOptions = filteredPredictions.filter(p => p.category === 'BACKUP');

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                College Predictor
              </h1>
              <p className="text-sm text-gray-600">Find the best colleges matching your CET performance</p>
            </div>
            
            {step === 2 && (
              <div className="flex items-center gap-4">
                {/* Category Selector */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-1">Add as:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setAddCategory('HIGH')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        addCategory === 'HIGH' 
                          ? 'bg-red-100 text-red-700 border border-red-300 shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ⭐ High
                    </button>
                    <button
                      onClick={() => setAddCategory('MEDIUM')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        addCategory === 'MEDIUM' 
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ✅ Medium
                    </button>
                    <button
                      onClick={() => setAddCategory('LOW')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        addCategory === 'LOW' 
                          ? 'bg-green-100 text-green-700 border border-green-300 shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🛡️ Low
                    </button>
                  </div>
                </div>

                {/* Option Form Counter */}
                <button
                  onClick={navigateToOptionForm}
                  className="text-right bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <p className="text-xs text-gray-600 group-hover:text-blue-600">Option Form</p>
                  <p className="text-xl font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    {optionForm.length}/150 
                    <List className="w-4 h-4" />
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 ? (
          <ProfileDisplaySection
            profileData={profileData}
            handlePredict={handlePredict}
            loading={loading}
            navigate={navigate}
          />
        ) : (
          <ResultsSection
            highChance={highChance}
            moderateChance={moderateChance}
            backupOptions={backupOptions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            addToOptionForm={addToOptionForm}
            addAllToCategory={addAllToCategory}
            optionForm={optionForm}
            profileData={profileData}
            totalPredictions={filteredPredictions.length}
            showLadiesOnly={showLadiesOnly}
            setShowLadiesOnly={setShowLadiesOnly}
            showPWD={showPWD}
            setShowPWD={setShowPWD}
            showDefence={showDefence}
            setShowDefence={setShowDefence}
            LADIES_ONLY_CATEGORIES={LADIES_ONLY_CATEGORIES}
          />
        )}
      </main>
    </div>
  );
}

function ProfileDisplaySection({ profileData, handlePredict, loading, navigate }) {
  const isProfileComplete = profileData?.rank && profileData?.percentile && 
                            profileData?.branches?.length > 0 && profileData?.gender;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Profile Data</h2>
                <p className="text-sm text-gray-600">Review your information before predicting</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {!isProfileComplete && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">Incomplete Profile</p>
                <p className="text-sm text-yellow-700">
                  Please complete your profile with CET rank, percentile, gender, and preferred branches.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Academic Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Academic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">MHT-CET Rank</p>
                <p className="text-2xl font-bold text-blue-600">
                  {profileData?.rank || (
                    <span className="text-gray-400 text-lg">Not set</span>
                  )}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Percentile</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {profileData?.percentile ? `${profileData.percentile}%` : (
                    <span className="text-gray-400 text-lg">Not set</span>
                  )}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="text-2xl font-bold text-purple-600">
                  {profileData?.category || 'OPEN'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Gender</p>
                <p className="text-2xl font-bold text-pink-600">
                  {profileData?.gender || (
                    <span className="text-gray-400 text-lg">Not set</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Preferred Branches */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Preferred Branches ({profileData?.branches?.length || 0} selected)
            </h3>
            {profileData?.branches && profileData.branches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileData.branches.map((branch, index) => (
                  <div
                    key={`${branch}-${index}`}
                    className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{branch}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 text-center text-gray-500">
                <p className="text-sm">No branches selected. Please update your profile.</p>
              </div>
            )}
          </div>

          {/* Preferred Cities */}
          {profileData?.preferredCities && profileData.preferredCities.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Preferred Cities ({profileData.preferredCities.length} selected)
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.preferredCities.map((city, index) => (
                  <span
                    key={`${city}-${index}`}
                    className="bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={loading || !isProfileComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finding Best Colleges...
              </>
            ) : (
              <>
                <GraduationCap className="w-5 h-5" />
                Predict My Colleges
              </>
            )}
          </button>

          {!isProfileComplete && (
            <p className="text-center text-sm text-gray-500">
              Complete your profile to enable predictions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsSection({ 
  highChance,
  moderateChance,
  backupOptions,
  searchQuery, 
  setSearchQuery, 
  addToOptionForm,
  addAllToCategory,
  optionForm,
  profileData,
  totalPredictions,
  showLadiesOnly,
  setShowLadiesOnly,
  showPWD,
  setShowPWD,
  showDefence,
  setShowDefence,
  LADIES_ONLY_CATEGORIES
}) {
  const topChoicesRef = React.useRef(null);
  const perfectMatchRef = React.useRef(null);
  const safeOptionsRef = React.useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
  };

  const isMale = profileData?.gender === 'Male' || profileData?.gender === 'M';

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Your Profile</h2>
            <p className="text-blue-100">Showing colleges matched to your performance</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Percentile</p>
            <p className="text-2xl font-bold">{profileData?.percentile}%</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Rank</p>
            <p className="text-2xl font-bold">{profileData?.rank}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Category</p>
            <p className="text-2xl font-bold">{profileData?.category}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Gender</p>
            <p className="text-2xl font-bold">{profileData?.gender || 'N/A'}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Branches</p>
            <p className="text-2xl font-bold">{profileData?.branches?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your College Matches: {totalPredictions} Colleges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CategorySummaryCard
            title="Top Choices"
            subtitle="Premium colleges that match your profile"
            icon={<Award className="w-6 h-6 text-green-600" />}
            colleges={highChance}
            color="green"
            onScroll={() => scrollToSection(topChoicesRef)}
            onAddAll={() => addAllToCategory(highChance, 'HIGH')}
            optionForm={optionForm}
          />
          
          <CategorySummaryCard
            title="Perfect Match"
            subtitle="Colleges ideally suited for your percentile"
            icon={<Target className="w-6 h-6 text-blue-600" />}
            colleges={moderateChance}
            color="blue"
            onScroll={() => scrollToSection(perfectMatchRef)}
            onAddAll={() => addAllToCategory(moderateChance, 'MEDIUM')}
            optionForm={optionForm}
          />
          
          <CategorySummaryCard
            title="Safe Options"
            subtitle="Reliable backup colleges with high admission chances"
            icon={<Shield className="w-6 h-6 text-orange-600" />}
            colleges={backupOptions}
            color="orange"
            onScroll={() => scrollToSection(safeOptionsRef)}
            onAddAll={() => addAllToCategory(backupOptions, 'LOW')}
            optionForm={optionForm}
          />
        </div>
      </div>

      {/* Search Bar with Enhanced Quota Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by college name, branch, or city..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
          />
        </div>

        {/* Quota Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700">Show Additional Seats:</p>
          
          <div className="flex flex-wrap gap-4">
            {/* Ladies-only filter (only show for males) */}
            {isMale && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showLadiesOnly}
                  onChange={(e) => setShowLadiesOnly(e.target.checked)}
                  className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-2 focus:ring-pink-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition">
                  👩 Ladies-only Seats (L-Category)
                </span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={showPWD}
                onChange={(e) => setShowPWD(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                ♿ PWD (Person with Disability) Seats
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={showDefence}
                onChange={(e) => setShowDefence(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                🎖️ Defence Quota Seats
              </span>
            </label>
          </div>
        </div>

        {/* Active Filters Info */}
        {(showLadiesOnly || showPWD || showDefence) && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Showing {[
                showLadiesOnly && 'Ladies-only',
                showPWD && 'PWD',
                showDefence && 'Defence'
              ].filter(Boolean).join(', ')} quota seats along with regular seats
            </span>
          </div>
        )}

        {/* Gender-based info message */}
        {isMale && (
          <div className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            ℹ️ Results filtered for Male candidates. Women-only colleges (like Cummins) and L-category seats are excluded by default.
          </div>
        )}
        {!isMale && profileData?.gender && (
          <div className="text-xs text-gray-600 bg-pink-50 px-3 py-2 rounded-lg">
            ℹ️ Results include all colleges including women-only institutions and L-category seats.
          </div>
        )}
      </div>

      {/* Top Choices */}
      {highChance.length > 0 && (
        <div ref={topChoicesRef} className="scroll-mt-20">
          <CategorySection
            title="Top Choices"
            subtitle="Premium colleges that match your profile"
            icon={<Award className="w-6 h-6" />}
            colleges={highChance}
            color="green"
            addToOptionForm={addToOptionForm}
            optionForm={optionForm}
            LADIES_ONLY_CATEGORIES={LADIES_ONLY_CATEGORIES}
          />
        </div>
      )}

      {/* Perfect Match */}
      {moderateChance.length > 0 && (
        <div ref={perfectMatchRef} className="scroll-mt-20">
          <CategorySection
            title="Perfect Match"
            subtitle="Colleges ideally suited for your percentile"
            icon={<Target className="w-6 h-6" />}
            colleges={moderateChance}
            color="blue"
            addToOptionForm={addToOptionForm}
            optionForm={optionForm}
            LADIES_ONLY_CATEGORIES={LADIES_ONLY_CATEGORIES}
          />
        </div>
      )}

      {/* Safe Options */}
      {backupOptions.length > 0 && (
        <div ref={safeOptionsRef} className="scroll-mt-20">
          <CategorySection
            title="Safe Options"
            subtitle="Reliable backup colleges with high admission chances"
            icon={<Shield className="w-6 h-6" />}
            colleges={backupOptions}
            color="orange"
            addToOptionForm={addToOptionForm}
            optionForm={optionForm}
            LADIES_ONLY_CATEGORIES={LADIES_ONLY_CATEGORIES}
          />
        </div>
      )}

      {/* Strategy Guide */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          Smart Strategy for CAP Option Form
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <p><strong>Start with Top Choices:</strong> Add 30-40 premium colleges from the first section</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <p><strong>Fill with Perfect Matches:</strong> Add 50-60 colleges from the second section</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <p><strong>Secure with Safe Options:</strong> Add 40-50 colleges from the third section</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 font-bold">4</div>
            <p><strong>Utilize all 150 choices</strong> for maximum opportunities in the admission process</p>
          </div>
        </div>
      </div>

      {/* No Results */}
      {totalPredictions === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Colleges Found</h3>
          <p className="text-gray-600">Try adjusting your profile, search query, or filter settings</p>
        </div>
      )}
    </div>
  );
}

function CategorySummaryCard({ title, subtitle, icon, colleges, color, onScroll, onAddAll, optionForm }) {
  const colorClasses = {
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-900',
      button: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      button: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      button: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  };

  const colors = colorClasses[color];
  const availableColleges = colleges.filter(c => !optionForm.find(o => o.branch_code === c.branch_code));

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-5 transition-all hover:shadow-lg`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className={`font-bold ${colors.text}`}>{title}</h3>
          <p className={`text-sm ${colors.text} opacity-80`}>{subtitle}</p>
        </div>
      </div>
      
      <p className="text-4xl font-bold mb-2">{colleges.length}</p>
      <p className="text-sm opacity-75 mb-4">colleges available</p>

      <div className="space-y-2">
        <button
          onClick={onScroll}
          disabled={colleges.length === 0}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            colleges.length > 0 
              ? 'bg-white hover:shadow-md cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          View Colleges
        </button>
        
        <button
          onClick={onAddAll}
          disabled={availableColleges.length === 0}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            availableColleges.length > 0 
              ? `${colors.button} cursor-pointer` 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Add All ({availableColleges.length})
        </button>
      </div>
    </div>
  );
}

function CategorySection({ title, subtitle, icon, colleges, color, addToOptionForm, optionForm, LADIES_ONLY_CATEGORIES }) {
  const colorClasses = {
    green: {
      border: 'border-green-200',
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      text: 'text-green-900',
      icon: 'bg-green-100 text-green-600'
    },
    blue: {
      border: 'border-blue-200',
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      text: 'text-blue-900',
      icon: 'bg-blue-100 text-blue-600'
    },
    orange: {
      border: 'border-orange-200',
      bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
      text: 'text-orange-900',
      icon: 'bg-orange-100 text-orange-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div>
      <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-5 mb-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colors.icon} rounded-lg`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${colors.text}`}>{title}</h3>
            <p className={`text-sm ${colors.text} opacity-80`}>{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {colleges.map((college, index) => (
          <CollegeCard
            key={college.branch_code || `college-${index}`}
            college={college}
            onAdd={addToOptionForm}
            isAdded={optionForm.some(c => c.branch_code === college.branch_code)}
            LADIES_ONLY_CATEGORIES={LADIES_ONLY_CATEGORIES}
          />
        ))}
      </div>
    </div>
  );
}

function CollegeCard({ college, onAdd, isAdded, LADIES_ONLY_CATEGORIES }) {
  const quotaCategory = (college.quota_category || 'OPEN').toUpperCase();
  const isLadiesOnly = LADIES_ONLY_CATEGORIES.includes(quotaCategory);
  const isPWD = quotaCategory.includes('PWD');
  const isDefence = quotaCategory.includes('DEF') || quotaCategory.includes('DEFENCE');
  const isSpecialQuota = isLadiesOnly || isPWD || isDefence;
  
  return (
    <div className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {college.college_name}
              </h3>
              <p className="text-gray-600 font-medium">{college.branch}</p>
            </div>
            <div className="ml-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                #{college.rank}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="font-bold text-gray-900">{college.city}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="font-bold text-gray-900 text-sm">{college.type}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Cutoff</p>
              <p className="font-bold text-indigo-600">{college.historical_cutoff}%</p>
            </div>
            <div className={`rounded-lg p-3 ${
              isLadiesOnly ? 'bg-pink-50' : 
              isPWD ? 'bg-blue-50' : 
              isDefence ? 'bg-green-50' : 
              'bg-gray-50'
            }`}>
              <p className="text-xs text-gray-500 mb-1">Quota</p>
              <p className={`font-bold text-sm ${
                isLadiesOnly ? 'text-pink-700' : 
                isPWD ? 'text-blue-700' : 
                isDefence ? 'text-green-700' : 
                'text-gray-900'
              }`}>
                {college.quota_category}
                {isLadiesOnly && ' 👩'}
                {isPWD && ' ♿'}
                {isDefence && ' 🎖️'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              college.closeness <= 2 
                ? 'bg-green-100 text-green-700' 
                : college.closeness <= 5 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {college.closeness <= 2 ? 'Excellent Match' : college.closeness <= 5 ? 'Good Match' : 'Fair Match'}
            </div>
          </div>
        </div>

        <div className="lg:w-48">
          <button
            onClick={() => onAdd(college)}
            disabled={isAdded}
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isAdded
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add to Form
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}