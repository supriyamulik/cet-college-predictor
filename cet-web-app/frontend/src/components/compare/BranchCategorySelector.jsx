// D:\CET_Prediction\cet-web-app\frontend\src\components\compare\BranchCategorySelector.jsx

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { collegeApi } from '../../services/collegeApi';

const BranchCategorySelector = ({ 
  selectedColleges, 
  selectedBranch, 
  selectedCategory,
  onBranchChange,
  onCategoryChange 
}) => {
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch branches and categories from the API
      const [branchesData, categoriesData] = await Promise.all([
        collegeApi.getBranches(),
        collegeApi.getCategories()
      ]);
      
      setBranches(branchesData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching branches/categories:', error);
      setError('Failed to load options. Please try again.');
      setBranches([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 font-medium">Loading branch and category options...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={fetchOptions}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-blue-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Select Branch & Category for Comparison
        </h3>
        <p className="text-sm text-gray-600">
          Choose the same branch and category to compare cutoff trends across selected colleges
        </p>
      </div>
      
      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Branch Selector */}
        <div>
          <label 
            htmlFor="branch-select" 
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            id="branch-select"
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-800 font-medium"
          >
            <option value="">-- Select Branch --</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          {!selectedBranch && (
            <p className="mt-1 text-xs text-gray-500">
              Select the engineering branch to compare
            </p>
          )}
        </div>

        {/* Category Selector */}
        <div>
          <label 
            htmlFor="category-select" 
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-800 font-medium"
          >
            <option value="">-- Select Category --</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {!selectedCategory && (
            <p className="mt-1 text-xs text-gray-500">
              Select the admission category (e.g., GOPENH, GSCH, etc.)
            </p>
          )}
        </div>
      </div>

      {/* Warning Message */}
      {(!selectedBranch || !selectedCategory) && (
        <div className="mt-4 flex items-start space-x-2 p-3 bg-amber-50 border border-amber-300 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Required:</span> Please select both branch and category to enable the comparison button
          </p>
        </div>
      )}

      {/* Success Message */}
      {selectedBranch && selectedCategory && (
        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Ready to compare <span className="font-semibold">{selectedBranch}</span> for category <span className="font-semibold">{selectedCategory}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BranchCategorySelector;