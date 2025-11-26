import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../config/firebase';
import toast from 'react-hot-toast';
import {
  ArrowLeft, GripVertical, Trash2, Eye, EyeOff,
  Filter, Download, Upload, Save, BarChart3,
  ChevronUp, ChevronDown, Search, Settings,
  Target, Shield, Award, AlertTriangle
} from 'lucide-react';

export default function OptionFormBuilder() {
//   const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [optionForm, setOptionForm] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  // Load saved option form
  useEffect(() => {
    const savedForm = localStorage.getItem('currentOptionForm');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        // Add initial priorities if not present
        const formWithPriorities = parsedForm.map((item, index) => ({
          ...item,
          priority: index + 1
        }));
        setOptionForm(formWithPriorities);
      } catch (error) {
        console.error('Error loading saved form:', error);
      }
    }
  }, []);

  // Save to localStorage whenever optionForm changes
  useEffect(() => {
    localStorage.setItem('currentOptionForm', JSON.stringify(optionForm));
  }, [optionForm]);

  const filteredForm = optionForm.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'ALL' || 
      item.user_category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newForm = [...optionForm];
    const draggedItem = newForm[dragIndex];
    newForm.splice(dragIndex, 1);
    newForm.splice(dropIndex, 0, draggedItem);

    // Update priorities
    const updatedForm = newForm.map((item, index) => ({
      ...item,
      priority: index + 1
    }));

    setOptionForm(updatedForm);
    setDragIndex(null);
  };

  const removeCollege = (index) => {
    const newForm = optionForm.filter((_, i) => i !== index);
    const updatedForm = newForm.map((item, i) => ({
      ...item,
      priority: i + 1
    }));
    setOptionForm(updatedForm);
    toast.success('College removed from form');
  };

  const movePriority = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === optionForm.length - 1)) {
      return;
    }

    const newForm = [...optionForm];
    const targetIndex = index + direction;
    [newForm[index], newForm[targetIndex]] = [newForm[targetIndex], newForm[index]];

    const updatedForm = newForm.map((item, i) => ({
      ...item,
      priority: i + 1
    }));

    setOptionForm(updatedForm);
  };

  const getCategoryStats = () => {
    const stats = {
      HIGH: { count: 0, percent: 0 },
      MEDIUM: { count: 0, percent: 0 },
      LOW: { count: 0, percent: 0 }
    };

    optionForm.forEach(item => {
      if (stats[item.user_category]) {
        stats[item.user_category].count++;
      }
    });

    Object.keys(stats).forEach(key => {
      stats[key].percent = optionForm.length > 0 ? 
        Math.round((stats[key].count / optionForm.length) * 100) : 0;
    });

    return stats;
  };

  const exportForm = () => {
    const csvContent = "Priority,Category,College,Branch,City,Type,Historical Cutoff,Predicted Cutoff,Probability\n" +
      optionForm.map(item => 
        `${item.priority},"${item.user_category}","${item.college_name}","${item.branch}","${item.city}","${item.type}",${item.historical_cutoff},${item.predicted_cutoff},${item.admission_probability}`
      ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cap-option-form-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Option form exported successfully');
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/predictor')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  CAP Option Form Builder
                </h1>
                <p className="text-sm text-gray-600">
                  Strategic priority management for {optionForm.length}/150 choices
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`p-2 rounded-lg transition-colors ${
                  showAnalysis ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={exportForm}
                disabled={optionForm.length === 0}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Strategy Overview */}
        {showAnalysis && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Strategic Distribution Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border-2 border-red-200 rounded-xl bg-red-50">
                <Award className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{categoryStats.HIGH.count}</div>
                <div className="text-sm text-red-700">Dream Colleges</div>
                <div className="text-xs text-red-600 mt-1">
                  {categoryStats.HIGH.percent}% of total
                </div>
              </div>
              <div className="text-center p-4 border-2 border-blue-200 rounded-xl bg-blue-50">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{categoryStats.MEDIUM.count}</div>
                <div className="text-sm text-blue-700">Perfect Match</div>
                <div className="text-xs text-blue-600 mt-1">
                  {categoryStats.MEDIUM.percent}% of total
                </div>
              </div>
              <div className="text-center p-4 border-2 border-green-200 rounded-xl bg-green-50">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{categoryStats.LOW.count}</div>
                <div className="text-sm text-green-700">Safety Net</div>
                <div className="text-xs text-green-600 mt-1">
                  {categoryStats.LOW.percent}% of total
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Strategic Recommendations</span>
              </div>
              <div className="text-sm text-yellow-700 space-y-1">
                {optionForm.length < 150 && (
                  <p>• Add {150 - optionForm.length} more colleges to maximize chances</p>
                )}
                {categoryStats.HIGH.percent < 15 && (
                  <p>• Consider adding more dream colleges (target 15-20%)</p>
                )}
                {categoryStats.LOW.percent < 25 && (
                  <p>• Ensure adequate safety net coverage (target 25-30%)</p>
                )}
                {optionForm.length >= 120 && (
                  <p>• Good progress! Consider fine-tuning priority order</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search colleges or branches..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="HIGH">Dream Colleges</option>
                <option value="MEDIUM">Perfect Match</option>
                <option value="LOW">Safety Net</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/builder/guide')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Guide
              </button>
              <button
                onClick={() => navigate('/predictor')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add More Colleges
              </button>
            </div>
          </div>
        </div>

        {/* Option Form List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {filteredForm.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {optionForm.length === 0 ? 'Your option form is empty' : 'No colleges match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {optionForm.length === 0 
                  ? 'Start by adding colleges from the predictor to build your strategic option form'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              <button
                onClick={() => navigate('/predictor')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Find Colleges
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredForm.map((item, index) => (
                <div
                  key={`${item.branch_code}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(optionForm.findIndex(i => i.branch_code === item.branch_code))}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(optionForm.findIndex(i => i.branch_code === item.branch_code))}
                  className="p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    {/* Drag Handle and Priority */}
                    <div className="flex flex-col items-center gap-2">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move hover:text-gray-600" />
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {item.priority}
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => movePriority(optionForm.findIndex(i => i.branch_code === item.branch_code), -1)}
                          disabled={item.priority === 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => movePriority(optionForm.findIndex(i => i.branch_code === item.branch_code), 1)}
                          disabled={item.priority === optionForm.length}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* College Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {item.college_name}
                          </h3>
                          <p className="text-gray-600 font-medium">{item.branch}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            item.user_category === 'HIGH' ? 'bg-red-100 text-red-700' :
                            item.user_category === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.user_category === 'HIGH' ? 'DREAM' : 
                             item.user_category === 'MEDIUM' ? 'MATCH' : 'SAFETY'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="font-medium">{item.city}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{item.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Cutoff:</span>
                          <p className="font-medium text-indigo-600">{item.historical_cutoff}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Probability:</span>
                          <p className={`font-medium ${
                            item.admission_probability >= 70 ? 'text-green-600' :
                            item.admission_probability >= 50 ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {item.admission_probability}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeCollege(optionForm.findIndex(i => i.branch_code === item.branch_code))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        {optionForm.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{optionForm.length}</div>
                <div className="text-sm text-gray-600">Colleges Added</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{150 - optionForm.length}</div>
                <div className="text-sm text-gray-600">Remaining Slots</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <button
                onClick={exportForm}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Form
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}