import React, { useState } from 'react';
import { 
  ExternalLink, Plus, Check, MapPin, 
  Building, Globe, BookOpen, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const Card = ({ college, onAdd, isAdded, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddClick = () => {
    if (!isAdded) {
      onAdd(college);
    }
  };

  const handleWebsiteClick = (e) => {
    e.stopPropagation();
    if (college.URL) {
      window.open(college.URL, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Website URL not available');
    }
  };

  // Extract college details
  const collegeCode = college['College Code'] || college.college_code || 'N/A';
  const collegeName = college['College Name'] || college.college_name || 'Unknown College';
  const city = college.City || college.city || 'Unknown';
  const url = college.URL || college.website || '';

  return (
    <div 
      className={`bg-white border rounded-xl shadow-sm transition-all duration-300 transform ${
        isHovered ? 'shadow-lg scale-[1.02] border-blue-300' : 'border-gray-200 hover:shadow-md'
      } ${isAdded ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header with Code and Actions */}
        <div className="flex justify-between items-start mb-4">
          {/* College Code Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              collegeCode.startsWith('0') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {collegeCode}
            </div>
            {isAdded && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                Added
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {url && (
              <button
                onClick={handleWebsiteClick}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Visit College Website"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* College Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
          {collegeName}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{city}</span>
        </div>

        {/* Additional Info (if available) */}
        <div className="space-y-2 mb-6">
          {college.type && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building className="w-3.5 h-3.5" />
              <span>{college.type}</span>
            </div>
          )}
          
          {college.branch && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{college.branch}</span>
            </div>
          )}
          
          {college.historical_cutoff > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span className="font-semibold text-blue-600">
                Cutoff: {college.historical_cutoff}%
              </span>
            </div>
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddClick}
          disabled={isAdded || isLoading}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isLoading
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : isAdded ? (
            <>
              <Check className="w-5 h-5" />
              Added to Form
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add to Option Form
            </>
          )}
        </button>

        {/* Website Link (full width if no URL button above) */}
        {url && (
          <button
            onClick={handleWebsiteClick}
            className="w-full mt-3 py-2 px-4 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Visit College Website
          </button>
        )}
      </div>

      {/* Hover effect indicator */}
      <div className={`h-1 rounded-b-xl bg-gradient-to-r from-blue-500 to-indigo-500 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
};

export default Card;