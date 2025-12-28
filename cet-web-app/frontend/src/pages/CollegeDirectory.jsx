import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Home, Building, Download, Filter, Search, 
  MapPin, Globe, BookOpen, PlusCircle,
  RefreshCw, Info, BarChart3, Grid, List,
  Check, Plus, ExternalLink, ChevronDown,
  GraduationCap, Target, ArrowLeft, Building2
} from 'lucide-react';

// Import components
import CollegeCard from '../components/CollegeDirectory/Card';
import Filters from '../components/CollegeDirectory/Filters';

const API_URL = 'http://localhost:5000';

// Main College Directory Component
export default function CollegeDirectory() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingCollege, setAddingCollege] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [optionForm, setOptionForm] = useState([]);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    city: 'ALL',
    category: 'OPEN',
    hasCutoff: 'all'
  });
  
  const [availableCities, setAvailableCities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load colleges and current option form
  useEffect(() => {
    fetchColleges();
    loadOptionForm();
    fetchStatistics();
  }, []);

  // Filter colleges when filters change
  useEffect(() => {
    if (colleges.length > 0) {
      const timer = setTimeout(() => {
        filterColleges();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [filters]);

  const loadOptionForm = () => {
    try {
      const saved = localStorage.getItem('currentOptionForm');
      if (saved) {
        setOptionForm(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading option form:', error);
    }
  };

  const fetchColleges = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/api/colleges/directory`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      setColleges(result.colleges);
      setAvailableCities(result.cities || []);
      setLastUpdated(result.timestamp);
      toast.success(`Loaded ${result.colleges.length} colleges`);
    } else {
      toast.error(result.error || 'Failed to load colleges');
    }
  } catch (error) {
    console.error('Error fetching colleges:', error);
    toast.error('Failed to load college directory');
  } finally {
    setLoading(false);
  }
};

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/colleges/stats`);
      const result = await response.json();
      
      if (result.success) {
        setStatistics(result.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filterColleges = async () => {
    if (!filters.search && filters.city === 'ALL' && filters.hasCutoff === 'all') {
      return; // Use local filtering for basic cases
    }
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: filters.search,
        city: filters.city,
        category: filters.category,
        has_cutoff: filters.hasCutoff
      }).toString();
      
      const response = await fetch(`${API_URL}/api/colleges/filter?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setColleges(result.colleges);
      }
    } catch (error) {
      console.error('Error filtering colleges:', error);
      toast.error('Failed to filter colleges');
    } finally {
      setLoading(false);
    }
  };

  const addToOptionForm = async (college) => {
  setAddingCollege(college['College Code']);
  
  try {
    // Call backend to get proper cutoff data
    const response = await fetch(
      `${API_URL}/api/colleges/${college['College Code']}/add-to-form`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: filters.category,
          branch: 'Computer Engineering' // You can make this selectable
        })
      }
    );
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to add college');
    }
    
    // Get current option form
    const savedOptionForm = localStorage.getItem('currentOptionForm');
    let currentForm = savedOptionForm ? JSON.parse(savedOptionForm) : [];
    
    // Add the college with proper cutoff data from backend
    currentForm.push(result.college);
    
    // Sort by historical cutoff (descending)
    currentForm.sort((a, b) => (b.historical_cutoff || 0) - (a.historical_cutoff || 0));
    
    // Update priorities
    currentForm = currentForm.map((item, index) => ({
      ...item,
      priority: index + 1
    }));
    
    // Save to localStorage
    localStorage.setItem('currentOptionForm', JSON.stringify(currentForm));
    setOptionForm(currentForm);
    
    toast.success(
      <div>
        <p className="font-semibold">✅ {college['College Name']} added!</p>
        {result.college.historical_cutoff > 0 ? (
          <p className="text-sm">Cutoff: {result.college.historical_cutoff}%</p>
        ) : (
          <p className="text-sm text-gray-500">No historical cutoff data</p>
        )}
      </div>,
      { duration: 3000 }
    );
    
  } catch (error) {
    console.error('Error adding college:', error);
    toast.error('Failed to add college to option form');
  } finally {
    setAddingCollege(null);
  }
};
  const getAveragePercentile = () => {
    // Get average percentile from option form if exists
    if (optionForm.length > 0) {
      const avg = optionForm.reduce((sum, college) => sum + (college.historical_cutoff || 0), 0) / optionForm.length;
      return avg;
    }
    return 75; // Default percentile
  };

  const getSearchCategory = (category) => {
    // Map category to search category format
    const mapping = {
      'OPEN': 'GOPENS',
      'OBC': 'GOBCS',
      'SC': 'GSCS',
      'ST': 'GSTS',
      'EWS': 'EWS'
    };
    return mapping[category] || 'GOPENS';
  };

  const isInOptionForm = (collegeCode) => {
    return optionForm.some(college => college.college_code === collegeCode);
  };

  const refreshData = () => {
    fetchColleges();
    fetchStatistics();
  };

  const exportColleges = () => {
    if (colleges.length === 0) {
      toast.error('No colleges to export');
      return;
    }

    const csvContent = [
      ['Code', 'Name', 'City', 'Type', 'Historical Cutoff', 'URL'],
      ...colleges.map(c => [
        c['College Code'],
        `"${c['College Name']}"`,
        c.City,
        c.type || 'Unknown',
        c.historical_cutoff || 'N/A',
        c.URL || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `college-directory-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Directory exported to CSV');
  };

  const filteredColleges = colleges.filter(college => {
    // Apply local filters for quick response
    const matchesSearch = !filters.search || 
      college['College Name']?.toLowerCase().includes(filters.search.toLowerCase()) ||
      college['College Code']?.toString().includes(filters.search);
    
    const matchesCity = filters.city === 'ALL' || college.City === filters.city;
    
    // Has cutoff filter
    let matchesCutoff = true;
    if (filters.hasCutoff === 'yes') {
      matchesCutoff = college.historical_cutoff > 0;
    } else if (filters.hasCutoff === 'no') {
      matchesCutoff = !college.historical_cutoff || college.historical_cutoff === 0;
    }
    
    return matchesSearch && matchesCity && matchesCutoff;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Go to Dashboard"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-7 h-7 text-blue-600" />
                  CampusFinder
                </h1>
                <p className="text-sm text-gray-600">
                  Browse and add colleges to your option form
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Statistics Button */}
              {statistics && (
                <div className="hidden md:block px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>{statistics.total_colleges} Colleges</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={refreshData}
                  disabled={loading}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={exportColleges}
                  disabled={colleges.length === 0}
                  className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition disabled:opacity-50"
                  title="Export to CSV"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => navigate('/builder')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Option Form ({optionForm.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Banner */}
        {statistics && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">College Directory Overview</h2>
                <p className="text-blue-100 opacity-90">
                  Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Loading...'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold">{statistics.total_colleges}</div>
                  <div className="text-sm text-blue-200">Total Colleges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{statistics.total_cities}</div>
                  <div className="text-sm text-blue-200">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{statistics.website_coverage}</div>
                  <div className="text-sm text-blue-200">Have Website</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Component */}
        <Filters
          filters={filters}
          onFilterChange={(updates) => setFilters(prev => ({ ...prev, ...updates }))}
          availableCities={availableCities}
          totalColleges={filteredColleges.length}
          loading={loading}
        />

        {/* Additional Filter Options */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={loading}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Historical Data
                </label>
                <select
                  value={filters.hasCutoff}
                  onChange={(e) => setFilters(prev => ({ ...prev, hasCutoff: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={loading}
                >
                  <option value="all">All Colleges</option>
                  <option value="yes">With Cutoff Data</option>
                  <option value="no">Without Cutoff Data</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredColleges.length} of {colleges.length} colleges
              {filters.search && ` for "${filters.search}"`}
              {filters.city !== 'ALL' && ` in ${filters.city}`}
            </div>
          </div>
        </div>

        {/* Colleges Display */}
        {loading ? (
          // Loading Skeleton
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredColleges.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Colleges Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filters.search || filters.city !== 'ALL' || filters.hasCutoff !== 'all'
                ? 'Try adjusting your search filters'
                : 'No colleges available in the directory'}
            </p>
            <button
              onClick={() => setFilters({ search: '', city: 'ALL', category: 'OPEN', hasCutoff: 'all' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map(college => (
              <CollegeCard
                key={college['College Code']}
                college={college}
                onAdd={() => addToOptionForm(college)}
                isAdded={isInOptionForm(college['College Code'])}
                isLoading={addingCollege === college['College Code']}
              />
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredColleges.map(college => (
              <div 
                key={college['College Code']} 
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {college['College Code']}
                      </span>
                      {isInOptionForm(college['College Code']) && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Added
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {college['College Name']}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{college.City || 'Unknown'}</span>
                      </div>
                      
                      {college.type && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{college.type}</span>
                        </div>
                      )}
                      
                      {college.historical_cutoff > 0 && (
                        <div className="font-semibold text-blue-600">
                          Cutoff: {college.historical_cutoff}%
                        </div>
                      )}
                      
                      {college.URL && (
                        <a
                          href={college.URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToOptionForm(college)}
                    disabled={isInOptionForm(college['College Code']) || addingCollege === college['College Code']}
                    className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      isInOptionForm(college['College Code'])
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : addingCollege === college['College Code']
                        ? 'bg-blue-400 text-white cursor-wait'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {addingCollege === college['College Code'] ? (
                      'Adding...'
                    ) : isInOptionForm(college['College Code']) ? (
                      'Added'
                    ) : (
                      'Add to Form'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {filteredColleges.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600">
              <div>
                <p>
                  Need help? <span className="text-blue-600 cursor-pointer hover:underline">View tutorial</span> on adding colleges
                </p>
                {statistics && (
                  <p className="mt-1">
                    <span className="font-medium">{statistics.colleges_with_website}</span> colleges have website information
                  </p>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  Back to top ↑
                </button>
                
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span>Tip: Add colleges in cutoff order for best results</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}