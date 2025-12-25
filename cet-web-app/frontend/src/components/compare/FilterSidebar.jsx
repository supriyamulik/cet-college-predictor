// D:\CET_Prediction\cet-web-app\frontend\src\components\compare\FilterSidebar.jsx

import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { COLLEGE_TYPES, YEARS } from '../../utils/constants';
import { collegeApi } from '../../services/collegeApi';

const FilterSidebar = ({ onFilterChange, currentFilters, onClose }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const citiesData = await collegeApi.getCities();
      setCities(citiesData || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setError('Failed to load filter options');
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const handleReset = () => {
    onFilterChange({
      city: '',
      type: '',
      year: '2025'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 md:hidden"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading filters...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={fetchFilterOptions}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Filter Options */
        <div className="space-y-6">
          {/* Year Filter */}
          <div>
            <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              id="year-filter"
              value={currentFilters.year || '2025'}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {YEARS.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              id="city-filter"
              value={currentFilters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* College Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              College Type
            </label>
            <select
              id="type-filter"
              value={currentFilters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Types</option>
              {COLLEGE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 Select colleges first, then choose branch and category for comparison
            </p>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;