// src/components/compare/TrendInsights.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Award, Users } from 'lucide-react';
import StatCard from './StatCard';
import { calculateTrend, getTrendPercentage, calculateAverageRank } from '../../utils/helpers';

const TrendInsights = ({ colleges, comparisonData }) => {
  if (!comparisonData || Object.keys(comparisonData).length === 0) {
    return null;
  }

  // Calculate insights for each college
  const insights = colleges.map(college => {
    const collegeData = comparisonData[college.college_code] || [];
    const trend = calculateTrend(collegeData);
    const trendPercentage = getTrendPercentage(collegeData);
    const avgRank = calculateAverageRank(collegeData);
    const latestData = collegeData.find(d => d.year === '2025') || collegeData[collegeData.length - 1];
    
    return {
      college,
      trend,
      trendPercentage,
      avgRank,
      latestRank: latestData?.closing_rank,
      latestPercentile: latestData?.closing_percentile
    };
  });

  // Find best and most competitive
  const bestCollege = insights.reduce((best, current) => 
    (!best || parseInt(current.latestRank) < parseInt(best.latestRank)) ? current : best
  , null);

  const mostCompetitive = insights.reduce((best, current) => 
    (!best || parseFloat(current.trendPercentage) < parseFloat(best.trendPercentage)) ? current : best
  , null);

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Colleges"
          value={colleges.length}
          subtitle="Being compared"
          icon={Users}
          color="blue"
        />
        
        <StatCard
          title="Best Current Rank"
          value={bestCollege ? parseInt(bestCollege.latestRank).toLocaleString() : 'N/A'}
          subtitle={bestCollege?.college.college_name.split(',')[0].substring(0, 25)}
          icon={Award}
          color="green"
        />

        <StatCard
          title="Most Improved"
          value={mostCompetitive?.college.college_name.split(',')[0].substring(0, 20) || 'N/A'}
          subtitle={`${mostCompetitive?.trendPercentage}% change`}
          icon={TrendingUp}
          color="purple"
        />

        <StatCard
          title="Average Rank"
          value={Math.round(insights.reduce((sum, i) => sum + i.avgRank, 0) / insights.length).toLocaleString()}
          subtitle="Across all colleges"
          icon={TrendingDown}
          color="yellow"
        />
      </div>

      {/* Individual College Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Individual Trends
        </h3>
        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">
                  {insight.college.college_name.split(',')[0]}
                </h4>
                <p className="text-sm text-gray-600">
                  Latest Rank: {parseInt(insight.latestRank).toLocaleString()} | 
                  Avg: {insight.avgRank.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {insight.trend === 'increasing' ? (
                  <TrendingUp className="w-5 h-5 text-red-500" />
                ) : insight.trend === 'decreasing' ? (
                  <TrendingDown className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="w-5 h-5 text-gray-500">→</span>
                )}
                <span className={`font-semibold ${
                  insight.trend === 'increasing' ? 'text-red-600' : 
                  insight.trend === 'decreasing' ? 'text-green-600' : 
                  'text-gray-600'
                }`}>
                  {insight.trendPercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendInsights;