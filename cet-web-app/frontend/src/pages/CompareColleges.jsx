// D:\CET_Prediction\cet-web-app\frontend\src\pages\CompareColleges.jsx

import React, { useState, useEffect } from 'react';
import { Search, Filter as FilterIcon, ArrowRight, Download } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { collegeApi } from '../services/collegeApi';
import CollegeCard from '../components/compare/CollegeCard';
import FilterSidebar from '../components/compare/FilterSidebar';
import ComparisonTable from '../components/compare/ComparisonTable';
import ComparisonGraph from '../components/compare/ComparisonGraph';
import SelectedColleges from '../components/compare/SelectedColleges';
import TrendInsights from '../components/compare/TrendInsights';
import BranchCategorySelector from '../components/compare/BranchCategorySelector';
import { debounce } from '../utils/helpers';
import { MAX_COLLEGES_TO_COMPARE, STATUS_MESSAGES } from '../utils/constants';

const CompareColleges = () => {
  const {
    selectedColleges,
    comparisonData,
    filters,
    loading,
    addCollege,
    removeCollege,
    clearAll,
    updateFilters,
    setComparisonData,
    setLoading
  } = useComparison();

  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchColleges();
  }, [filters]);

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      fetchColleges();
    }
  }, [searchQuery]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      // Only city, type, year filters - NO branch/category
      const data = await collegeApi.getAllColleges(filters);
      setColleges(data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      alert('Failed to fetch colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(async (query) => {
    try {
      setLoading(true);
      const data = await collegeApi.searchColleges(query, filters);
      setColleges(data);
    } catch (error) {
      console.error('Error searching colleges:', error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleCompare = async () => {
    if (selectedColleges.length < 2) {
      alert(STATUS_MESSAGES.SELECT_COLLEGES);
      return;
    }

    if (!selectedBranch || !selectedCategory) {
      alert('Please select branch and category for comparison');
      return;
    }

    try {
      setLoading(true);
      const collegeCodes = selectedColleges.map(c => c.college_code);
      const data = await collegeApi.compareColleges(collegeCodes, selectedBranch, selectedCategory);
      setComparisonData(data);
      setShowComparison(true);
    } catch (error) {
      console.error('Error comparing colleges:', error);
      alert('Failed to compare colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert('Export feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Compare Engineering Colleges
          </h1>
          <p className="text-gray-600">
            Select colleges first, then choose branch and category to compare cutoff trends
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!showComparison ? (
          /* Selection View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <FilterSidebar
                currentFilters={filters}
                onFilterChange={updateFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search colleges by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <FilterIcon className="w-5 h-5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Selected Colleges */}
              {selectedColleges.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Selected Colleges ({selectedColleges.length}/{MAX_COLLEGES_TO_COMPARE})
                    </h2>
                    <button
                      onClick={clearAll}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <SelectedColleges
                    colleges={selectedColleges}
                    onRemove={removeCollege}
                  />
                  
                  {selectedColleges.length >= 2 && (
                    <div className="mt-4 space-y-3">
                      <BranchCategorySelector
                        selectedColleges={selectedColleges}
                        selectedBranch={selectedBranch}
                        selectedCategory={selectedCategory}
                        onBranchChange={setSelectedBranch}
                        onCategoryChange={setSelectedCategory}
                      />
                      <button
                        onClick={handleCompare}
                        disabled={loading || !selectedBranch || !selectedCategory}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            Compare Colleges
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* College List */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Available Colleges
                  {filters.city && <span className="text-gray-600 font-normal"> in {filters.city}</span>}
                </h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">{STATUS_MESSAGES.LOADING}</p>
                  </div>
                ) : colleges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colleges.map((college) => (
                      <CollegeCard
                        key={college.college_code}
                        college={college}
                        onSelect={addCollege}
                        isSelected={selectedColleges.some(c => c.college_code === college.college_code)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {STATUS_MESSAGES.NO_DATA}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Comparison View */
          <div>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
              <button
                onClick={() => setShowComparison(false)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                ← Back to Selection
              </button>
              <div className="text-sm text-gray-600">
                Comparing: <span className="font-semibold">{selectedBranch}</span> - <span className="font-semibold">{selectedCategory}</span>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>

            {/* Comparison Content */}
            <div className="space-y-6">
              {/* Trend Insights */}
              <TrendInsights
                colleges={selectedColleges}
                comparisonData={comparisonData}
              />

              {/* Comparison Graph */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Cutoff Trends (2021-2025)
                </h2>
                <ComparisonGraph
                  colleges={selectedColleges}
                  comparisonData={comparisonData}
                />
              </div>

              {/* Comparison Table */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Detailed Comparison
                </h2>
                <ComparisonTable
                  colleges={selectedColleges}
                  comparisonData={comparisonData}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareColleges;