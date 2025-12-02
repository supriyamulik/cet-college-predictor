import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

const Filters = ({ 
  filters, 
  onFilterChange, 
  availableCities, 
  totalColleges,
  loading = false 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Find Colleges</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Colleges
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search by name or code..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={loading}
            />
          </div>
        </div>

        {/* City Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition"
              disabled={loading}
            >
              <option value="ALL">All Cities</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : totalColleges.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {totalColleges === 1 ? 'College found' : 'Colleges found'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick City Filters */}
      {availableCities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Cities:</p>
          <div className="flex flex-wrap gap-2">
            {['Pune', 'Mumbai', 'Nagpur', 'Aurangabad', 'Nashik'].map(city => (
              <button
                key={city}
                onClick={() => onFilterChange({ city })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.city === city
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={loading}
              >
                {city}
              </button>
            ))}
            <button
              onClick={() => onFilterChange({ city: 'ALL' })}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filters.city === 'ALL'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              All Cities
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;