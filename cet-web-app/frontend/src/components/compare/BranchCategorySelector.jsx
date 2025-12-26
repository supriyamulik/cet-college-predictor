// src/components/compare/BranchCategorySelector.jsx
import React, { useState, useEffect } from 'react';
import { GitBranch, Users, AlertCircle, Loader2 } from 'lucide-react';
import { collegeApi } from '../../services/collegeApi';

const BranchCategorySelector = ({
  selectedColleges,
  selectedBranch,
  selectedCategory,
  onBranchChange,
  onCategoryChange,
}) => {
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCommonBranches();
  }, [selectedColleges]);

  useEffect(() => {
    if (selectedBranch) {
      fetchCommonCategories();
    } else {
      setCategories([]);
      onCategoryChange('');
    }
  }, [selectedBranch, selectedColleges]);

  const fetchCommonBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const collegeCodes = selectedColleges.map(c => c.college_code);
      console.log('🌿 Fetching common branches for:', collegeCodes);
      
      const data = await collegeApi.getBranches(collegeCodes);
      
      console.log('🌿 Available branches:', data);
      setBranches(Array.isArray(data) ? data : []);
      
      // Reset selections if current branch is not available
      if (selectedBranch && !data.includes(selectedBranch)) {
        onBranchChange('');
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to load branches');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommonCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const collegeCodes = selectedColleges.map(c => c.college_code);
      console.log('📋 Fetching common categories for:', collegeCodes, selectedBranch);
      
      const data = await collegeApi.getCategories(collegeCodes, selectedBranch);
      
      console.log('📋 Available categories:', data);
      setCategories(Array.isArray(data) ? data : []);
      
      // Reset category if current one is not available
      if (selectedCategory && !data.includes(selectedCategory)) {
        onCategoryChange('');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading && branches.length === 0 && categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium text-sm">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Branch Selector */}
      <div>
        <label htmlFor="branch-selector" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <GitBranch className="w-4 h-4" />
          Select Branch
          {branches.length > 0 && (
            <span className="text-gray-500 font-normal">
              ({branches.length} common {branches.length === 1 ? 'branch' : 'branches'})
            </span>
          )}
        </label>
        <select
          id="branch-selector"
          value={selectedBranch}
          onChange={(e) => onBranchChange(e.target.value)}
          disabled={loading || branches.length === 0}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {branches.length === 0 
              ? 'No common branches available' 
              : 'Choose a branch...'}
          </option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        {branches.length === 0 && !loading && (
          <p className="mt-1 text-xs text-gray-500">
            The selected colleges don't have any branches in common
          </p>
        )}
      </div>

      {/* Category Selector */}
      <div>
        <label htmlFor="category-selector" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Users className="w-4 h-4" />
          Select Category
          {categories.length > 0 && (
            <span className="text-gray-500 font-normal">
              ({categories.length} common {categories.length === 1 ? 'category' : 'categories'})
            </span>
          )}
        </label>
        <select
          id="category-selector"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={!selectedBranch || loading || categories.length === 0}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {!selectedBranch
              ? 'Select a branch first'
              : categories.length === 0
                ? 'No common categories available'
                : 'Choose a category...'}
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {selectedBranch && categories.length === 0 && !loading && (
          <p className="mt-1 text-xs text-gray-500">
            No common categories found for this branch across selected colleges
          </p>
        )}
      </div>

      {/* Info Message */}
      {branches.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 Only branches and categories available in <strong>all selected colleges</strong> are shown
          </p>
        </div>
      )}
    </div>
  );
};

export default BranchCategorySelector;