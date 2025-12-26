// src/components/compare/ComparisonTable.jsx
import React from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ComparisonTable = ({ colleges, comparisonData }) => {
  if (!comparisonData || Object.keys(comparisonData).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comparison data available
      </div>
    );
  }

  // Get all unique years across all colleges
  const allYears = new Set();
  Object.values(comparisonData).forEach(collegeData => {
    collegeData.forEach(record => {
      allYears.add(record.year);
    });
  });
  const years = Array.from(allYears).sort();

  // Helper function to get rank for a specific college and year
  const getRankForYear = (collegeCode, year) => {
    const collegeData = comparisonData[collegeCode] || [];
    const record = collegeData.find(r => r.year === year);
    return record?.closing_rank || null;
  };

  // Helper function to get percentile for a specific college and year
  const getPercentileForYear = (collegeCode, year) => {
    const collegeData = comparisonData[collegeCode] || [];
    const record = collegeData.find(r => r.year === year);
    return record?.closing_percentile || null;
  };

  // Calculate trend (comparing first and last available year)
  const getTrend = (collegeCode) => {
    const collegeData = comparisonData[collegeCode] || [];
    if (collegeData.length < 2) return null;

    const sortedData = [...collegeData].sort((a, b) => a.year.localeCompare(b.year));
    const firstRank = sortedData[0]?.closing_rank;
    const lastRank = sortedData[sortedData.length - 1]?.closing_rank;

    if (!firstRank || !lastRank) return null;

    const change = lastRank - firstRank;
    const changePercent = ((change / firstRank) * 100).toFixed(1);

    return {
      change,
      changePercent,
      direction: change > 0 ? 'easier' : change < 0 ? 'harder' : 'stable'
    };
  };

  // Get college name from colleges array
  const getCollegeName = (collegeCode) => {
    const college = colleges.find(c => c.college_code === collegeCode);
    return college?.college_name || `College ${collegeCode}`;
  };

  // Get college URL
  const getCollegeUrl = (collegeCode) => {
    const college = colleges.find(c => c.college_code === collegeCode);
    const collegeData = comparisonData[collegeCode]?.[0];
    return college?.college_url || collegeData?.college_url || null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
              College
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">
              Trend
            </th>
            {years.map(year => (
              <th key={year} className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {colleges.map((college, idx) => {
            const collegeCode = college.college_code;
            const trend = getTrend(collegeCode);
            const collegeUrl = getCollegeUrl(collegeCode);

            return (
              <tr
                key={collegeCode}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* College Name with URL */}
                <td className="px-4 py-3 sticky left-0 bg-inherit z-10 border-r border-gray-200">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {getCollegeName(collegeCode)}
                    </span>
                    {collegeUrl && (
                      <a
                        href={collegeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </td>

                {/* Trend */}
                <td className="px-4 py-3 text-center">
                  {trend ? (
                    <div className="flex flex-col items-center gap-1">
                      {trend.direction === 'harder' && (
                        <>
                          <TrendingUp className="w-5 h-5 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">
                            Harder
                          </span>
                          <span className="text-xs text-gray-600">
                            {Math.abs(trend.changePercent)}%
                          </span>
                        </>
                      )}
                      {trend.direction === 'easier' && (
                        <>
                          <TrendingDown className="w-5 h-5 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            Easier
                          </span>
                          <span className="text-xs text-gray-600">
                            {Math.abs(trend.changePercent)}%
                          </span>
                        </>
                      )}
                      {trend.direction === 'stable' && (
                        <>
                          <Minus className="w-5 h-5 text-gray-600" />
                          <span className="text-xs text-gray-600 font-medium">
                            Stable
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </td>

                {/* Year Data */}
                {years.map(year => {
                  const rank = getRankForYear(collegeCode, year);
                  const percentile = getPercentileForYear(collegeCode, year);

                  return (
                    <td
                      key={year}
                      className="px-4 py-3 text-center whitespace-nowrap"
                    >
                      {rank ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {rank.toLocaleString()}
                          </span>
                          {percentile && (
                            <span className="text-xs text-gray-500">
                              {percentile.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="font-semibold">Trend:</div>
          <TrendingUp className="w-4 h-4 text-red-600" />
          <span>Competition Increasing</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-600" />
          <span>Competition Decreasing</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="w-4 h-4 text-gray-600" />
          <span>Stable</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;