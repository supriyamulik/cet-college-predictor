// src/context/ComparisonContext.jsx
import { createContext, useContext, useState } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    branch: '',
    category: '',
    year: '2025'
  });
  const [loading, setLoading] = useState(false);

  const addCollege = (college) => {
    if (selectedColleges.length >= 5) {
      alert('You can compare maximum 5 colleges at once');
      return;
    }
    if (selectedColleges.find(c => c.college_code === college.college_code)) {
      alert('College already selected');
      return;
    }
    setSelectedColleges([...selectedColleges, college]);
  };

  const removeCollege = (collegeCode) => {
    setSelectedColleges(selectedColleges.filter(c => c.college_code !== collegeCode));
  };

  const clearAll = () => {
    setSelectedColleges([]);
    setComparisonData(null);
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      type: '',
      branch: '',
      category: '',
      year: '2025'
    });
  };

  const value = {
    selectedColleges,
    comparisonData,
    filters,
    loading,
    addCollege,
    removeCollege,
    clearAll,
    updateFilters,
    resetFilters,
    setComparisonData,
    setLoading
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};