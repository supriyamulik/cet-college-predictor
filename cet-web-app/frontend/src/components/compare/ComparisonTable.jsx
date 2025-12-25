// D:\CET_Prediction\cet-web-app\frontend\src\components\compare\ComparisonTable.jsx

import React from 'react';
import { formatRank } from '../../utils/helpers';

const ComparisonTable = ({ colleges, comparisonData }) => {
  if (!comparisonData || Object.keys(comparisonData).length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">No comparison data available</p>
      </div>
    );
  }

  const years = ['2021', '2022', '2023', '2024', '2025'];

  // Check if we have any data
  const hasAnyData = colleges.some(college => {
    const collegeData = comparisonData[college.college_code];
    return collegeData && Array.isArray(collegeData) && collegeData.length > 0;
  });

  if (!hasAnyData) {
    return (
      <div className="text-center py-12 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <p className="text-yellow-800 text-lg font-medium">No data available for comparison</p>
        <p className="text-yellow-600 text-sm mt-2">
          Try selecting different colleges or a different branch/category combination.
        </p>
      </div>
    );
  }

  const getYearData = (college, year) => {
    const collegeData = comparisonData[college.college_code];
    
    if (!collegeData || !Array.isArray(collegeData)) {
      return null;
    }
    
    // Find data for this year - handle different field name variations
    const yearData = collegeData.find(d => {
      const dataYear = String(d.year || d.Year || d.YEAR || '');
      return dataYear === year;
    });
    
    return yearData;
  };

  const formatPercentile = (value) => {
    if (!value && value !== 0) return 'N/A';
    const num = parseFloat(value);
    return isNaN(num) ? 'N/A' : `${num.toFixed(2)}%`;
  };

  const getRankTrend = (college) => {
    const data = comparisonData[college.college_code];
    if (!data || data.length < 2) return null;

    // Sort by year
    const sortedData = [...data]
      .filter(d => d.closing_rank || d.Closing_Rank)
      .sort((a, b) => {
        const yearA = parseInt(a.year || a.Year || 0);
        const yearB = parseInt(b.year || b.Year || 0);
        return yearA - yearB;
      });

    if (sortedData.length < 2) return null;

    const firstRank = parseInt(sortedData[0].closing_rank || sortedData[0].Closing_Rank);
    const lastRank = parseInt(sortedData[sortedData.length - 1].closing_rank || sortedData[sortedData.length - 1].Closing_Rank);

    if (firstRank < lastRank) {
      return { direction: 'down', text: 'Decreasing Competition' };
    } else if (firstRank > lastRank) {
      return { direction: 'up', text: 'Increasing Competition' };
    }
    return { direction: 'stable', text: 'Stable' };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
              College
            </th>
            {years.map(year => (
              <th key={year} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {year}
              </th>
            ))}
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trend
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {colleges.map((college, idx) => {
            const trend = getRankTrend(college);
            return (
              <tr key={college.college_code} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-10">
                  <div className="max-w-xs">
                    <div className="font-semibold">{college.college_name.split(',')[0]}</div>
                    <div className="text-xs text-gray-500">{college.city}</div>
                  </div>
                </td>
                {years.map(year => {
                  const yearData = getYearData(college, year);
                  const rank = yearData?.closing_rank || yearData?.Closing_Rank;
                  const percentile = yearData?.closing_percentile || yearData?.Closing_Percentile;
                  
                  return (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {yearData ? (
                        <div>
                          <div className="font-semibold text-gray-900">
                            {rank ? formatRank(rank) : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPercentile(percentile)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {trend ? (
                    <div className="flex items-center justify-center gap-1">
                      {trend.direction === 'up' && (
                        <span className="text-red-500">↑</span>
                      )}
                      {trend.direction === 'down' && (
                        <span className="text-green-500">↓</span>
                      )}
                      {trend.direction === 'stable' && (
                        <span className="text-blue-500">→</span>
                      )}
                      <span className={`text-xs ${
                        trend.direction === 'up' ? 'text-red-600' :
                        trend.direction === 'down' ? 'text-green-600' :
                        'text-blue-600'
                      }`}>
                        {trend.text}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-lg">↓</span>
            <span>Decreasing Competition (Rank going up over years)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">↑</span>
            <span>Increasing Competition (Rank improving over years)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 text-lg">→</span>
            <span>Stable Competition</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <strong>Note:</strong> Lower closing rank means higher competition. Percentile shown below rank.
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            Debug Info (click to expand)
          </summary>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
            <div><strong>Colleges:</strong> {colleges.length}</div>
            <div><strong>Comparison Data Keys:</strong> {Object.keys(comparisonData).join(', ')}</div>
            {colleges.map(college => {
              const data = comparisonData[college.college_code];
              return (
                <div key={college.college_code} className="mt-2">
                  <strong>{college.college_code}:</strong> {data ? `${data.length} records` : 'No data'}
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
};

export default ComparisonTable;