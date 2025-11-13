import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Search, Plus, CheckCircle, Award, Target, Shield, User, GraduationCap
} from 'lucide-react';

const API_URL = 'http://localhost:5000';

export default function Predictor() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [optionForm, setOptionForm] = useState([]);

  const [formData, setFormData] = useState({
    rank: '',
    percentile: '',
    category: 'OPEN',
    city: '',
    branches: []
  });

  const branches = [
    'Computer Engineering',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Electronics & Telecommunication',
    'Artificial Intelligence'
  ];

  const categories = ['OPEN', 'OBC', 'SC', 'ST', 'EWS', 'TFWS'];

  const handleSubmit = async () => {
    if (!formData.rank || !formData.percentile) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.branches.length === 0) {
      toast.error('Please select at least one branch');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: parseInt(formData.rank),
          percentile: parseFloat(formData.percentile),
          category: formData.category,
          city: formData.city || null,
          branches: formData.branches
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
      toast.error('Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleBranch = (branch) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch]
    }));
  };

  const filteredPredictions = predictions.filter(p =>
    searchQuery === '' || 
    (p.college_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.branch || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToOptionForm = (college) => {
    if (!optionForm.find(c => c.branch_code === college.branch_code)) {
      setOptionForm([...optionForm, { ...college, priority: optionForm.length + 1 }]);
      toast.success('Added to Option Form!');
    } else {
      toast.error('Already in Option Form');
    }
  };

  // Group by category
  const highChance = filteredPredictions.filter(p => p.category === 'HIGH');
  const moderateChance = filteredPredictions.filter(p => p.category === 'MODERATE');
  const backupOptions = filteredPredictions.filter(p => p.category === 'BACKUP');

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
              <div className="text-right bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-600">Option Form</p>
                <p className="text-xl font-bold text-blue-600">{optionForm.length}/150</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 ? (
          <StudentFormSection
            formData={formData}
            setFormData={setFormData}
            branches={branches}
            categories={categories}
            toggleBranch={toggleBranch}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        ) : (
          <ResultsSection
            highChance={highChance}
            moderateChance={moderateChance}
            backupOptions={backupOptions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            addToOptionForm={addToOptionForm}
            optionForm={optionForm}
            formData={formData}
            totalPredictions={filteredPredictions.length}
          />
        )}
      </main>
    </div>
  );
}

function StudentFormSection({ formData, setFormData, branches, categories, toggleBranch, handleSubmit, loading }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Enter Your CET Details</h2>
              <p className="text-sm text-gray-600">We'll find the best colleges for you</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                MHT-CET Rank <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                placeholder="Enter your rank"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Percentile <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.percentile}
                onChange={(e) => setFormData({ ...formData, percentile: e.target.value })}
                placeholder="Enter percentile (0-100)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred City (Optional)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Pune, Mumbai"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Branches <span className="text-red-500">*</span>
              <span className="ml-2 text-xs text-gray-500">({formData.branches.length} selected)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => toggleBranch(branch)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.branches.includes(branch)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                      formData.branches.includes(branch)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {formData.branches.includes(branch) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`font-medium ${
                      formData.branches.includes(branch) ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {branch}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finding Best Colleges...
              </>
            ) : (
              <>
                <GraduationCap className="w-5 h-5" />
                Find My Colleges
              </>
            )}
          </button>
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
  optionForm,
  formData,
  totalPredictions
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Percentile</p>
            <p className="text-2xl font-bold">{formData.percentile}%</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Rank</p>
            <p className="text-2xl font-bold">{formData.rank}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Category</p>
            <p className="text-2xl font-bold">{formData.category}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Location</p>
            <p className="text-2xl font-bold">{formData.city || 'Any'}</p>
          </div>
        </div>
      </div>

      {/* Results Summary - Clickable */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your College Matches: {totalPredictions} Colleges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => scrollToSection(topChoicesRef)}
            disabled={highChance.length === 0}
            className={`bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 text-left transition-all ${
              highChance.length > 0 
                ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-bold text-green-900">Top Choices</span>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-1">{highChance.length}</p>
            <p className="text-sm text-green-700">Best colleges within reach</p>
            {highChance.length > 0 && (
              <p className="text-xs text-green-600 mt-2 font-semibold">Click to view →</p>
            )}
          </button>
          
          <button
            onClick={() => scrollToSection(perfectMatchRef)}
            disabled={moderateChance.length === 0}
            className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 text-left transition-all ${
              moderateChance.length > 0 
                ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-bold text-blue-900">Perfect Match</span>
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-1">{moderateChance.length}</p>
            <p className="text-sm text-blue-700">Ideal options for you</p>
            {moderateChance.length > 0 && (
              <p className="text-xs text-blue-600 mt-2 font-semibold">Click to view →</p>
            )}
          </button>
          
          <button
            onClick={() => scrollToSection(safeOptionsRef)}
            disabled={backupOptions.length === 0}
            className={`bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-5 text-left transition-all ${
              backupOptions.length > 0 
                ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <span className="font-bold text-orange-900">Safe Options</span>
            </div>
            <p className="text-4xl font-bold text-orange-600 mb-1">{backupOptions.length}</p>
            <p className="text-sm text-orange-700">Secure backup choices</p>
            {backupOptions.length > 0 && (
              <p className="text-xs text-orange-600 mt-2 font-semibold">Click to view →</p>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
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
          <p className="text-gray-600">Try adjusting your filters or selecting different branches</p>
        </div>
      )}
    </div>
  );
}

function CategorySection({ title, subtitle, icon, colleges, color, addToOptionForm, optionForm }) {
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
        {colleges.map((college) => (
          <CollegeCard
            key={college.branch_code}
            college={college}
            onAdd={addToOptionForm}
            isAdded={optionForm.some(c => c.branch_code === college.branch_code)}
          />
        ))}
      </div>
    </div>
  );
}

function CollegeCard({ college, onAdd, isAdded }) {
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
              <p className="text-xs text-gray-500 mb-1">Last Year Cutoff</p>
              <p className="font-bold text-indigo-600">{college.historical_cutoff}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <p className="font-bold text-gray-900">{college.quota_category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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