import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, ArrowUp, ArrowDown, Trash2, Download,
  MapPin, GraduationCap, Filter,
  Database, FileText, Table, FileSpreadsheet,
  Check, ChevronUp, ChevronDown
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = 'http://localhost:5000';

export default function OptionFormBuilder() {
  const navigate = useNavigate();
  const [optionForm, setOptionForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Load option form from localStorage
  useEffect(() => {
    const savedOptionForm = localStorage.getItem('currentOptionForm');
    if (savedOptionForm) {
      const formData = JSON.parse(savedOptionForm);
      setOptionForm(formData);
    }
  }, []);

  // Keep original order until auto-rank is clicked
  const [autoRanked, setAutoRanked] = useState(false);

  // Get sorted colleges (only when auto-ranked)
  const displayedColleges = useMemo(() => {
    if (autoRanked) {
      // Sort by cutoff when auto-ranked
      return [...optionForm].sort((a, b) => b.historical_cutoff - a.historical_cutoff)
        .map((college, index) => ({ ...college, priority: index + 1 }));
    } else {
      // Keep manual order
      return optionForm;
    }
  }, [optionForm, autoRanked]);

  // AUTO-RANK FUNCTION
  const handleAutoRank = () => {
    if (optionForm.length === 0) {
      toast.error('No colleges in option form to rank');
      return;
    }

    // Sort by cutoff descending
    const sortedForm = [...optionForm].sort((a, b) => b.historical_cutoff - a.historical_cutoff)
      .map((college, index) => ({ ...college, priority: index + 1 }));

    setOptionForm(sortedForm);
    setAutoRanked(true);
    localStorage.setItem('currentOptionForm', JSON.stringify(sortedForm));
    
    const highestCutoff = sortedForm[0]?.historical_cutoff || 0;
    toast.success(`Ranked ${sortedForm.length} colleges! Highest: ${highestCutoff}%`);
  };

  // MOVE SINGLE COLLEGE
  const moveCollege = (branchCode, direction) => {
    setAutoRanked(false); // Disable auto-ranking when manually moving
    
    const currentIndex = optionForm.findIndex(college => college.branch_code === branchCode);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === optionForm.length - 1)
    ) return;

    const newOptionForm = [...optionForm];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap the colleges
    [newOptionForm[currentIndex], newOptionForm[newIndex]] = 
    [newOptionForm[newIndex], newOptionForm[currentIndex]];

    // Update priorities based on new positions
    const updatedForm = newOptionForm.map((item, index) => ({
      ...item,
      priority: index + 1
    }));

    setOptionForm(updatedForm);
    localStorage.setItem('currentOptionForm', JSON.stringify(updatedForm));
    toast.success(`Moved ${direction} in priority`);
  };

  // BULK MOVE SELECTED COLLEGES
  const moveSelectedColleges = (direction) => {
    if (selectedColleges.length === 0) {
      toast.error('Select colleges first');
      return;
    }

    setAutoRanked(false); // Disable auto-ranking when manually moving
    
    const newOptionForm = [...optionForm];
    let moved = 0;

    // Get indices of selected colleges
    const selectedIndices = selectedColleges
      .map(branchCode => optionForm.findIndex(college => college.branch_code === branchCode))
      .sort((a, b) => direction === 'up' ? a - b : b - a);

    // Move each selected college
    for (const currentIndex of selectedIndices) {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Check bounds
      if (direction === 'up' && currentIndex === 0) continue;
      if (direction === 'down' && currentIndex === optionForm.length - 1) continue;
      
      // Swap
      [newOptionForm[currentIndex], newOptionForm[newIndex]] = 
      [newOptionForm[newIndex], newOptionForm[currentIndex]];
      moved++;
    }

    if (moved > 0) {
      // Update priorities
      const updatedForm = newOptionForm.map((item, index) => ({
        ...item,
        priority: index + 1
      }));

      setOptionForm(updatedForm);
      localStorage.setItem('currentOptionForm', JSON.stringify(updatedForm));
      toast.success(`Moved ${moved} college(s) ${direction}`);
    }
  };

  // TOGGLE SELECTION
  const toggleCollegeSelection = (branchCode) => {
    setSelectedColleges(prev => 
      prev.includes(branchCode) 
        ? prev.filter(code => code !== branchCode)
        : [...prev, branchCode]
    );
  };

  // SELECT ALL VISIBLE
  const selectAllVisible = () => {
    const visibleBranchCodes = displayedColleges.map(college => college.branch_code);
    setSelectedColleges(visibleBranchCodes);
    toast.success(`Selected ${visibleBranchCodes.length} colleges`);
  };

  // CLEAR SELECTION
  const clearSelection = () => {
    setSelectedColleges([]);
    toast.success('Selection cleared');
  };

  // REMOVE COLLEGE
  const removeFromOptionForm = (branchCode) => {
    const newOptionForm = optionForm.filter(college => college.branch_code !== branchCode);
    
    const updatedForm = newOptionForm.map((college, index) => ({
      ...college,
      priority: index + 1
    }));

    setOptionForm(updatedForm);
    localStorage.setItem('currentOptionForm', JSON.stringify(updatedForm));
    toast.success('College removed');
    
    // Remove from selection if selected
    if (selectedColleges.includes(branchCode)) {
      setSelectedColleges(prev => prev.filter(code => code !== branchCode));
    }
  };

  // REMOVE SELECTED COLLEGES
  const removeSelectedColleges = () => {
    if (selectedColleges.length === 0) {
      toast.error('Select colleges to remove');
      return;
    }

    const newOptionForm = optionForm.filter(
      college => !selectedColleges.includes(college.branch_code)
    );
    
    const updatedForm = newOptionForm.map((college, index) => ({
      ...college,
      priority: index + 1
    }));

    setOptionForm(updatedForm);
    localStorage.setItem('currentOptionForm', JSON.stringify(updatedForm));
    toast.success(`Removed ${selectedColleges.length} college(s)`);
    setSelectedColleges([]);
  };

  // Export functions remain the same...
  const exportToCSV = () => {
    if (optionForm.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Priority', 'College Name', 'Branch', 'City', 'Type', 'Historical Cutoff'];
    
    const csvRows = [
      headers.join(','),
      ...optionForm.map(college => [
        college.priority,
        `"${college.college_name}"`,
        `"${college.branch}"`,
        `"${college.city}"`,
        `"${college.type}"`,
        `${college.historical_cutoff}%`
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `option-form-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Exported to CSV!');
    setExportMenuOpen(false);
  };

  const exportToExcel = () => {
    if (optionForm.length === 0) {
      toast.error('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(optionForm.map(college => ({
      'Priority': college.priority,
      'College Name': college.college_name,
      'Branch': college.branch,
      'City': college.city,
      'Type': college.type,
      'Historical Cutoff': `${college.historical_cutoff}%`
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Option Form');
    
    XLSX.writeFile(workbook, `option-form-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success('Exported to Excel!');
    setExportMenuOpen(false);
  };

  const exportToPDF = () => {
    if (optionForm.length === 0) {
      toast.error('No data to export');
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('CAP Option Form', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    doc.text(`Total Colleges: ${optionForm.length}`, 14, 29);
    
    // Table data
    const tableData = optionForm.map(college => [
      college.priority,
      college.college_name,
      college.branch,
      college.city,
      college.type,
      `${college.historical_cutoff}%`
    ]);

    // Auto-table
    doc.autoTable({
      startY: 35,
      head: [['Priority', 'College Name', 'Branch', 'City', 'Type', 'Cutoff']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    doc.save(`option-form-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success('Exported to PDF!');
    setExportMenuOpen(false);
  };

  // STATISTICS
  const getStatistics = () => {
    const total = optionForm.length;
    const highestCutoff = optionForm.length > 0 ? Math.max(...optionForm.map(c => c.historical_cutoff || 0)) : 0;
    const avgCutoff = optionForm.length > 0 
      ? (optionForm.reduce((sum, c) => sum + (c.historical_cutoff || 0), 0) / optionForm.length).toFixed(2)
      : 0;

    return {
      total,
      highestCutoff,
      avgCutoff,
      selected: selectedColleges.length
    };
  };

  const stats = getStatistics();

  // Check move permissions for bulk actions
  const canMoveSelectedUp = selectedColleges.length > 0 && 
    selectedColleges.some(code => {
      const index = optionForm.findIndex(c => c.branch_code === code);
      return index > 0;
    });

  const canMoveSelectedDown = selectedColleges.length > 0 && 
    selectedColleges.some(code => {
      const index = optionForm.findIndex(c => c.branch_code === code);
      return index < optionForm.length - 1;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
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
                  {autoRanked ? 'Sorted by cutoff' : 'Manual order'} ({optionForm.length}/150)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Bulk Actions */}
              {selectedColleges.length > 0 && (
                <div className="flex gap-2 mr-4 border-r pr-4 border-gray-300">
                  <button
                    onClick={() => moveSelectedColleges('up')}
                    disabled={!canMoveSelectedUp}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition flex items-center gap-1 text-sm"
                  >
                    <ChevronUp className="w-4 h-4" />
                    Move Up
                  </button>
                  <button
                    onClick={() => moveSelectedColleges('down')}
                    disabled={!canMoveSelectedDown}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition flex items-center gap-1 text-sm"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Move Down
                  </button>
                  <button
                    onClick={removeSelectedColleges}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              )}

              <button
                onClick={handleAutoRank}
                disabled={optionForm.length === 0}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                Sort by Cutoff
              </button>
              
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  disabled={optionForm.length === 0}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={exportToPDF}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export as PDF
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export as Excel
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <Table className="w-4 h-4" />
                      Export as CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Option Form Summary</h2>
            <div className="flex items-center gap-3">
              {selectedColleges.length > 0 ? (
                <>
                  <span className="text-blue-600 font-medium">
                    {selectedColleges.length} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                  <button
                    onClick={selectAllVisible}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Select All ({displayedColleges.length})
                  </button>
                </>
              ) : (
                <button
                  onClick={selectAllVisible}
                  disabled={displayedColleges.length === 0}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Select All ({displayedColleges.length})
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Total Colleges</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.highestCutoff}%</div>
              <div className="text-sm text-green-700">Highest Cutoff</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{stats.avgCutoff}%</div>
              <div className="text-sm text-indigo-700">Average Cutoff</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              stats.selected > 0 ? 'bg-yellow-50' : 'bg-gray-50'
            }`}>
              <div className={`text-2xl font-bold ${
                stats.selected > 0 ? 'text-yellow-600' : 'text-gray-600'
              }`}>{stats.selected}</div>
              <div className="text-sm">Selected</div>
            </div>
          </div>
        </div>

        {/* Colleges List */}
        <div className="space-y-4">
          {displayedColleges.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {optionForm.length === 0 ? 'No Colleges Added' : 'No Colleges Match Filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {optionForm.length === 0 
                  ? 'Go back to Predictor to add colleges to your option form'
                  : 'Try adjusting your search filters'
                }
              </p>
              {optionForm.length === 0 && (
                <button
                  onClick={() => navigate('/predictor')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Predictor
                </button>
              )}
            </div>
          ) : (
            displayedColleges.map((college) => (
              <CollegePriorityCard
                key={college.branch_code}
                college={college}
                isSelected={selectedColleges.includes(college.branch_code)}
                onSelect={() => toggleCollegeSelection(college.branch_code)}
                onMoveUp={() => moveCollege(college.branch_code, 'up')}
                onMoveDown={() => moveCollege(college.branch_code, 'down')}
                onRemove={() => removeFromOptionForm(college.branch_code)}
                canMoveUp={optionForm.findIndex(c => c.branch_code === college.branch_code) > 0}
                canMoveDown={optionForm.findIndex(c => c.branch_code === college.branch_code) < optionForm.length - 1}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// College Priority Card Component - REMOVED "Historical Cutoff" tag
function CollegePriorityCard({ 
  college, 
  isSelected,
  onSelect,
  onMoveUp, 
  onMoveDown, 
  onRemove,
  canMoveUp,
  canMoveDown
}) {
  return (
    <div className={`bg-white border-2 rounded-xl p-6 transition-all ${
      isSelected 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-100 hover:border-blue-200 hover:shadow-lg'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Selection Checkbox */}
          <div className="flex-shrink-0 mt-1">
            <button
              onClick={onSelect}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                isSelected 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </button>
          </div>

          {/* Priority Number */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {college.priority}
            </div>
          </div>

          {/* College Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {college.college_name}
                </h3>
                <p className="text-gray-600 font-medium">{college.branch}</p>
              </div>
            </div>

            {/* College Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {college.city}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="font-bold text-gray-900 text-sm">{college.type}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Historical Cutoff</p>
                <p className="font-bold text-blue-600">{college.historical_cutoff}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Move up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Move down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          
          <button
            onClick={onRemove}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}