{/* Details Grid */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
  <InfoItem 
    icon={<MapPin className="w-4 h-4" />} 
    label="Location" 
    value={college.city} 
  />
  <InfoItem 
    icon={<Building2 className="w-4 h-4" />} 
    label="Type" 
    value={college.type} 
  />
  <InfoItem 
    icon={<TrendingUp className="w-4 h-4" />} 
    label={`${college.cutoff_year || '2024'} Cutoff`}  // Dynamic year
    value={`${college.cutoff_percentile}%ile`} 
  />
  <InfoItem 
    icon={<Award className="w-4 h-4" />} 
    label="Predicted 2025" 
    value={`${college.predicted_cutoff}%ile`}
    valueColor="text-blue-600"
  />
</div>