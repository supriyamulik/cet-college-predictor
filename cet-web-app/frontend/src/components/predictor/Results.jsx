{/* Details Grid in College Card */}
<div className="mb-4">
  <div className="flex items-center gap-2 mb-1">
    <span className="text-sm text-gray-600">Admission Chance:</span>
    <span className="text-3xl font-bold text-blue-600">{college.admission_probability}%</span>
    <span className="text-lg font-bold text-gray-600">
      ({college.admission_probability >= 85 ? 'HIGH ✅' : college.admission_probability >= 50 ? 'MODERATE 🔵' : 'LOW 🟠'})
    </span>
  </div>
</div>

{/* Details Grid */}
<div className="grid grid-cols-2 gap-3 text-sm">
  <div>
    <span className="text-gray-500">{college.cutoff_year || '2024'} Cutoff:</span>
    <span className="ml-2 font-bold text-gray-900">{college.cutoff_percentile}%ile</span>
  </div>
  <div>
    <span className="text-gray-500">Predicted 2025:</span>
    <span className="ml-2 font-bold text-blue-600">{college.predicted_cutoff}%ile</span>
  </div>
  <div>
    <span className="text-gray-500">Your Gap:</span>
    <span className={`ml-2 font-bold ${college.percentile_gap > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {college.percentile_gap > 0 ? '+' : ''}{college.percentile_gap}%ile
    </span>
  </div>
  <div>
    <span className="text-gray-500">Location:</span>
    <span className="ml-2 font-bold text-gray-900">{college.city}</span>
  </div>
</div>