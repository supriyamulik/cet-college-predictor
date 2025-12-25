// D:\CET_Prediction\cet-web-app\frontend\src\components\compare\StatCard.jsx

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
  };

  const getTrendIcon = () => {
    if (!trend && trend !== 0) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendText = () => {
    if (!trend && trend !== 0) return null;
    const absValue = Math.abs(trend);
    const color = trend > 0 ? 'text-red-600' : trend < 0 ? 'text-green-600' : 'text-gray-600';
    return (
      <span className={`text-xs font-medium ${color}`}>
        {trend > 0 ? '+' : ''}{trend}% from last year
      </span>
    );
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value || 'N/A'}</p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-gray-600 mb-2">{subtitle}</p>
      )}
      
      {(trend !== undefined && trend !== null) && (
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          {getTrendText()}
        </div>
      )}
    </div>
  );
};

export default StatCard;