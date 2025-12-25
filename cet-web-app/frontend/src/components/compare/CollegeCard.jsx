// D:\CET_Prediction\cet-web-app\frontend\src\components\compare\CollegeCard.jsx

import React from 'react';
import { MapPin, Building2, X } from 'lucide-react';
import { formatRank, formatPercentile, getCollegeTypeShort } from '../../utils/helpers';

const CollegeCard = ({ college, onRemove, isSelected = false, onSelect }) => {
  return (
    <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {college.college_name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
              {getCollegeTypeShort(college.type)}
            </span>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(college.college_code)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{college.city}</span>
        </div>
        
        {college.branch_name && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Branch: </span>
            <span className="text-gray-600">{college.branch_name}</span>
          </div>
        )}

        {college.category && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Category: </span>
            <span className="text-gray-600">{college.category}</span>
          </div>
        )}
      </div>

      {college.closing_rank && (
        <div className="border-t pt-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Closing Rank</p>
              <p className="font-semibold text-gray-800">
                {formatRank(college.closing_rank)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Percentile</p>
              <p className="font-semibold text-gray-800">
                {formatPercentile(college.closing_percentile)}
              </p>
            </div>
          </div>
          {college.year && (
            <p className="text-xs text-gray-500 mt-2">
              {college.year} - Round {college.cap_round}
            </p>
          )}
        </div>
      )}

      {onSelect && !isSelected && (
        <button
          onClick={() => onSelect(college)}
          className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Select for Comparison
        </button>
      )}

      {isSelected && (
        <div className="w-full mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium text-center">
          ✓ Selected
        </div>
      )}
    </div>
  );
};

export default CollegeCard;