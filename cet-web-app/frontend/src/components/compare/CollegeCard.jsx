// src/components/compare/CollegeCard.jsx
import React from 'react';
import { Building2, MapPin, ExternalLink, Check } from 'lucide-react';

const CollegeCard = ({ college, onSelect, onRemove, isSelected, disabled }) => {
  const handleClick = () => {
    if (isSelected) {
      onRemove(college.college_code);
    } else if (!disabled) {
      onSelect(college);
    }
  };

  return (
    <div
      className={`
        relative border rounded-lg p-4 transition-all cursor-pointer
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : disabled 
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
        }
      `}
      onClick={handleClick}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* College Name */}
      <h3 className="font-semibold text-gray-900 mb-3 pr-8 line-clamp-2">
        {college.college_name}
      </h3>

      {/* College Details */}
      <div className="space-y-2">
        {/* Type */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{college.type || college.type_normalized || 'N/A'}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{college.city}</span>
        </div>

        {/* College URL */}
        {college.college_url && (
          <a
            href={college.college_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Visit Website</span>
          </a>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleClick}
        disabled={disabled && !isSelected}
        className={`
          mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm
          ${isSelected
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {isSelected ? 'Remove' : disabled ? 'Max Limit Reached' : 'Select for Comparison'}
      </button>
    </div>
  );
};

export default CollegeCard;