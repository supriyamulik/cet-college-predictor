// D:\CET_Prediction\cet-web-app\frontend\src\utils\constants.js

// Categories available in CAP rounds
export const CATEGORIES = [
  { value: 'GOPENH', label: 'General Open (Home)' },
  { value: 'GOPENO', label: 'General Open (Other)' },
  { value: 'LOPENH', label: 'Linguistically Open (Home)' },
  { value: 'LOPENO', label: 'Linguistically Open (Other)' },
  { value: 'GSCS', label: 'General SC (State)' },
  { value: 'GSTS', label: 'General ST (State)' },
  { value: 'GVJS', label: 'General VJ (State)' },
  { value: 'GNT1S', label: 'General NT1 (State)' },
  { value: 'GNT2S', label: 'General NT2 (State)' },
  { value: 'GNT3S', label: 'General NT3 (State)' },
  { value: 'GOBCS', label: 'General OBC (State)' },
  { value: 'DEFH', label: 'Defense (Home)' },
  { value: 'DEFO', label: 'Defense (Other)' },
  { value: 'TFWS', label: 'Tuition Fee Waiver Scheme' }
];

// College types
export const COLLEGE_TYPES = [
  { value: 'Government', label: 'Government' },
  { value: 'Un-Aided', label: 'Un-Aided' },
  { value: 'Un-Aided Religious Minority - Jain', label: 'Un-Aided Minority (Jain)' },
  { value: 'Un-Aided Religious Minority - Muslim', label: 'Un-Aided Minority (Muslim)' },
  { value: 'Un-Aided Religious Minority - Christian', label: 'Un-Aided Minority (Christian)' },
  { value: 'Un-Aided Linguistic Minority - Gujarati', label: 'Un-Aided Minority (Gujarati)' },
  { value: 'Un-Aided Linguistic Minority - Hindi', label: 'Un-Aided Minority (Hindi)' },
  { value: 'University Department', label: 'University Department' }
];

// CAP Rounds
export const CAP_ROUNDS = [
  { value: 'I', label: 'Round I' },
  { value: 'II', label: 'Round II' },
  { value: 'III', label: 'Round III' }
];

// Years available
export const YEARS = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' }
];

// Popular branches
export const POPULAR_BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Electronics and Telecommunication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Artificial Intelligence and Data Science',
  'Computer Science and Engineering',
  'Instrumentation Engineering'
];

// Cities (Major ones)
export const MAJOR_CITIES = [
  'Mumbai',
  'Pune',
  'Thane',
  'Nagpur',
  'Nashik',
  'Aurangabad',
  'Kolhapur',
  'Solapur',
  'Amravati',
  'Navi Mumbai'
];

// Chart colors for comparison graphs
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16'  // lime
];

// Comparison limits
export const MAX_COLLEGES_TO_COMPARE = 5;
export const MIN_COLLEGES_TO_COMPARE = 2;

// Trend indicators
export const TREND_STATUS = {
  INCREASING: 'increasing',
  DECREASING: 'decreasing',
  STABLE: 'stable'
};

// Filter options
export const SORT_OPTIONS = [
  { value: 'rank_asc', label: 'Closing Rank (Low to High)' },
  { value: 'rank_desc', label: 'Closing Rank (High to Low)' },
  { value: 'percentile_asc', label: 'Percentile (Low to High)' },
  { value: 'percentile_desc', label: 'Percentile (High to Low)' },
  { value: 'name_asc', label: 'Name (A to Z)' },
  { value: 'name_desc', label: 'Name (Z to A)' }
];

// Status messages
export const STATUS_MESSAGES = {
  NO_DATA: 'No data available for the selected criteria',
  LOADING: 'Loading college data...',
  ERROR: 'Failed to fetch data. Please try again.',
  SELECT_COLLEGES: 'Please select at least 2 colleges to compare',
  MAX_LIMIT: `You can compare maximum ${MAX_COLLEGES_TO_COMPARE} colleges`,
  SUCCESS: 'Data loaded successfully'
};