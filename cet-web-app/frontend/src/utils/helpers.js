// D:\CET_Prediction\cet-web-app\frontend\src\utils\helpers.js

/**
 * Format rank with commas (e.g., 50000 -> 50,000)
 */
export const formatRank = (rank) => {
  if (!rank) return 'N/A';
  return parseInt(rank).toLocaleString('en-IN');
};

/**
 * Format percentile to 2 decimal places
 */
export const formatPercentile = (percentile) => {
  if (!percentile) return 'N/A';
  return parseFloat(percentile).toFixed(2) + '%';
};

/**
 * Get category label from code
 */
export const getCategoryLabel = (categoryCode) => {
  const categoryMap = {
    'GOPENH': 'General Open (Home)',
    'GOPENO': 'General Open (Other)',
    'LOPENH': 'Linguistically Open (Home)',
    'LOPENO': 'Linguistically Open (Other)',
    'GSCS': 'General SC',
    'GSTS': 'General ST',
    'GVJS': 'General VJ',
    'GNT1S': 'General NT1',
    'GNT2S': 'General NT2',
    'GNT3S': 'General NT3',
    'GOBCS': 'General OBC',
    'DEFH': 'Defense (Home)',
    'DEFO': 'Defense (Other)',
    'TFWS': 'TFWS'
  };
  return categoryMap[categoryCode] || categoryCode;
};

/**
 * Calculate trend (increasing/decreasing/stable)
 */
export const calculateTrend = (data) => {
  if (!data || data.length < 2) return 'stable';
  
  // Sort by year
  const sorted = [...data].sort((a, b) => a.year - b.year);
  const firstRank = parseInt(sorted[0].closing_rank);
  const lastRank = parseInt(sorted[sorted.length - 1].closing_rank);
  
  const change = ((lastRank - firstRank) / firstRank) * 100;
  
  if (change > 5) return 'increasing'; // Competition decreasing (rank increasing)
  if (change < -5) return 'decreasing'; // Competition increasing (rank decreasing)
  return 'stable';
};

/**
 * Get trend percentage change
 */
export const getTrendPercentage = (data) => {
  if (!data || data.length < 2) return 0;
  
  const sorted = [...data].sort((a, b) => a.year - b.year);
  const firstRank = parseInt(sorted[0].closing_rank);
  const lastRank = parseInt(sorted[sorted.length - 1].closing_rank);
  
  return (((lastRank - firstRank) / firstRank) * 100).toFixed(2);
};

/**
 * Sort colleges by criteria
 */
export const sortColleges = (colleges, sortBy) => {
  const sorted = [...colleges];
  
  switch (sortBy) {
    case 'rank_asc':
      return sorted.sort((a, b) => parseInt(a.closing_rank) - parseInt(b.closing_rank));
    case 'rank_desc':
      return sorted.sort((a, b) => parseInt(b.closing_rank) - parseInt(a.closing_rank));
    case 'percentile_asc':
      return sorted.sort((a, b) => parseFloat(a.closing_percentile) - parseFloat(b.closing_percentile));
    case 'percentile_desc':
      return sorted.sort((a, b) => parseFloat(b.closing_percentile) - parseFloat(a.closing_percentile));
    case 'name_asc':
      return sorted.sort((a, b) => a.college_name.localeCompare(b.college_name));
    case 'name_desc':
      return sorted.sort((a, b) => b.college_name.localeCompare(a.college_name));
    default:
      return sorted;
  }
};

/**
 * Filter colleges based on criteria
 */
export const filterColleges = (colleges, filters) => {
  return colleges.filter(college => {
    if (filters.city && college.city !== filters.city) return false;
    if (filters.type && !college.type.includes(filters.type)) return false;
    if (filters.branch && college.branch_name !== filters.branch) return false;
    if (filters.category && college.category !== filters.category) return false;
    if (filters.year && college.year !== filters.year) return false;
    return true;
  });
};

/**
 * Get unique values from array of objects
 */
export const getUniqueValues = (arr, key) => {
  return [...new Set(arr.map(item => item[key]))].filter(Boolean).sort();
};

/**
 * Debounce function for search
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate average closing rank
 */
export const calculateAverageRank = (data) => {
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + parseInt(item.closing_rank), 0);
  return Math.round(sum / data.length);
};

/**
 * Get college type short name
 */
export const getCollegeTypeShort = (type) => {
  if (type.includes('Government')) return 'Govt';
  if (type.includes('Un-Aided')) return 'Pvt';
  if (type.includes('University')) return 'Univ';
  return 'Other';
};

/**
 * Check if college is in user's preference range
 */
export const isInPreferenceRange = (rank, userRank, buffer = 5000) => {
  return rank >= (userRank - buffer) && rank <= (userRank + buffer);
};

/**
 * Format college name (shorten if too long)
 */
export const formatCollegeName = (name, maxLength = 50) => {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
};

/**
 * Export data as CSV
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => row[h]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Get color for trend indicator
 */
export const getTrendColor = (trend) => {
  switch (trend) {
    case 'increasing': return 'text-red-600';
    case 'decreasing': return 'text-green-600';
    case 'stable': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

/**
 * Get icon for trend
 */
export const getTrendIcon = (trend) => {
  switch (trend) {
    case 'increasing': return '↑';
    case 'decreasing': return '↓';
    case 'stable': return '→';
    default: return '→';
  }
};