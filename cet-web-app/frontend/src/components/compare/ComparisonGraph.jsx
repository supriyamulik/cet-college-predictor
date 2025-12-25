// D:\CET_Prediction\cet-web-app\frontend\src\components\compare\ComparisonGraph.jsx

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';
import { formatRank } from '../../utils/helpers';

const ComparisonGraph = ({ colleges, comparisonData }) => {
  const [dataType, setDataType] = useState('rank'); // 'rank' or 'percentile'
  const [chartData, setChartData] = useState([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    console.log('ComparisonGraph - colleges:', colleges);
    console.log('ComparisonGraph - comparisonData:', comparisonData);
    prepareChartData();
  }, [colleges, comparisonData, dataType]);

  if (!comparisonData || Object.keys(comparisonData).length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">No comparison data available</p>
        <p className="text-gray-400 text-sm mt-2">Please select colleges and try comparing again</p>
      </div>
    );
  }

  // Prepare data for chart
  const prepareChartData = () => {
    const years = ['2021', '2022', '2023', '2024', '2025'];
    const processedData = [];
    let foundData = false;
    
    years.forEach(year => {
      const dataPoint = { year };
      
      colleges.forEach((college, idx) => {
        const collegeData = comparisonData[college.college_code];
        
        // Debug logging
        if (idx === 0 && year === '2021') {
          console.log(`Sample college data for ${college.college_code}:`, collegeData);
        }
        
        if (collegeData && Array.isArray(collegeData)) {
          // Find data for this year
          const yearData = collegeData.find(d => {
            const dataYear = String(d.year || d.Year || d.YEAR || '');
            return dataYear === year;
          });
          
          if (yearData) {
            foundData = true;
            const collegeName = college.college_name.split(',')[0].substring(0, 30);
            
            // Handle different possible field names
            const rank = yearData.closing_rank || yearData.Closing_Rank || 
                        yearData.ClosingRank || yearData.rank || 
                        yearData.Rank;
            
            const percentile = yearData.closing_percentile || 
                             yearData.Closing_Percentile || 
                             yearData.ClosingPercentile || 
                             yearData.percentile || 
                             yearData.Percentile;
            
            if (dataType === 'rank' && rank) {
              dataPoint[collegeName] = parseInt(rank);
            } else if (dataType === 'percentile' && percentile) {
              dataPoint[collegeName] = parseFloat(percentile);
            }
          }
        }
      });
      
      processedData.push(dataPoint);
    });
    
    console.log('Processed chart data:', processedData);
    console.log('Has data:', foundData);
    
    setChartData(processedData);
    setHasData(foundData);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">Year: {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold text-gray-800">
                {dataType === 'rank' 
                  ? formatRank(entry.value)
                  : `${entry.value?.toFixed(2)}%`
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <div className="text-center py-12 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <p className="text-yellow-800 text-lg font-medium">No data available for selected filters</p>
        <p className="text-yellow-600 text-sm mt-2">
          The selected branch and category combination may not have historical data for these colleges.
        </p>
        <p className="text-yellow-600 text-sm mt-1">
          Try selecting a different branch or category.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setDataType('rank')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            dataType === 'rank'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Closing Rank
        </button>
        <button
          onClick={() => setDataType('percentile')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            dataType === 'percentile'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Percentile
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ 
              value: dataType === 'rank' ? 'Closing Rank' : 'Percentile (%)', 
              angle: -90, 
              position: 'insideLeft' 
            }}
            reversed={dataType === 'rank'}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {colleges.map((college, idx) => {
            const collegeName = college.college_name.split(',')[0].substring(0, 30);
            return (
              <Line
                key={college.college_code}
                type="monotone"
                dataKey={collegeName}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4, fill: CHART_COLORS[idx % CHART_COLORS.length] }}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong>{' '}
          {dataType === 'rank' 
            ? 'Lower rank indicates higher competition (better college performance). The graph is inverted for better visualization.'
            : 'Higher percentile indicates better performance. Missing data points are connected automatically.'
          }
        </p>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            Debug Info (click to expand)
          </summary>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
            <div><strong>Colleges:</strong> {colleges.length}</div>
            <div><strong>Data Keys:</strong> {Object.keys(comparisonData).join(', ')}</div>
            <div><strong>Chart Data Points:</strong> {chartData.length}</div>
            <div><strong>Has Data:</strong> {hasData ? 'Yes' : 'No'}</div>
          </div>
        </details>
      )}
    </div>
  );
};

export default ComparisonGraph;