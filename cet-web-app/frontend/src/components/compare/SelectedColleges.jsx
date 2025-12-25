// src/components/compare/SelectedColleges.jsx
import React from 'react';
import CollegeCard from './CollegeCard';

const SelectedColleges = ({ colleges, onRemove }) => {
  if (!colleges || colleges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-lg mb-2">No colleges selected yet</p>
        <p className="text-sm">Select colleges from the list below to start comparing</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {colleges.map((college) => (
        <CollegeCard
          key={college.college_code}
          college={college}
          onRemove={onRemove}
          isSelected={true}
        />
      ))}
    </div>
  );
};

export default SelectedColleges;