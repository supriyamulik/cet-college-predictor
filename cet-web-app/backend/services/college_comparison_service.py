# backend/services/college_comparison_service.py
import pandas as pd
import os
from typing import List, Dict, Optional
import sys

# Add parent directory to path to import comparator
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

class CollegeComparisonService:
    """Enhanced service with category/branch mapping and multi-year support"""
    
    def __init__(self):
        try:
            # Import the enhanced comparator
            from utils.college_comparator import CollegeComparator
            
            # Initialize comparator with proper paths
            data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
            
            self.comparator = CollegeComparator(
                merged_data_path=os.path.join(data_dir, 'merged_cutoff_2021_2025.csv'),
                individual_data_dir=os.path.join(data_dir, 'cutoff_trends'),
                colleges_url_path=os.path.join(data_dir, 'Colleges_URL.xlsx'),
                main_data_path=os.path.join(data_dir, 'flattened_CAP_data done.xlsx')
            )
            
            print("✅ CollegeComparisonService initialized with enhanced comparator")
            
        except Exception as e:
            print(f"❌ Error initializing CollegeComparisonService: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def get_all_colleges(self, filters: Dict = None) -> List[Dict]:
        """Get all colleges WITHOUT branch/category filtering"""
        try:
            colleges = self.comparator.get_all_colleges(filters)
            return colleges
        except Exception as e:
            print(f"❌ Error in get_all_colleges: {e}")
            return []
    
    def search_colleges(self, query: str, filters: Dict = None) -> List[Dict]:
        """Search colleges by name"""
        try:
            colleges = self.comparator.search_colleges(query, filters)
            return colleges
        except Exception as e:
            print(f"❌ Error in search_colleges: {e}")
            return []
    
    def get_college_by_code(self, college_code: str) -> Optional[Dict]:
        """Get specific college details with stats"""
        try:
            stats = self.comparator.get_college_stats(college_code)
            return stats if stats else None
        except Exception as e:
            print(f"❌ Error in get_college_by_code: {e}")
            return None
    
    def get_college_cutoffs(self, college_code: str, filters: Dict = None) -> List[Dict]:
        """Get cutoff data for a specific college"""
        try:
            # If branch and category are provided, use get_college_data
            if filters and filters.get('branch') and filters.get('category'):
                data = self.comparator.get_college_data(
                    college_code,
                    filters['branch'],
                    filters['category']
                )
                return data
            
            # Otherwise return all data for this college
            df = (self.comparator.merged_data if not self.comparator.merged_data.empty 
                  else self.comparator.individual_data)
            
            if df.empty:
                return []
            
            df_college = df[df['college_code'] == int(college_code)]
            
            if filters:
                if filters.get('year'):
                    df_college = df_college[df_college['year'] == str(filters['year'])]
            
            return df_college.to_dict('records')
            
        except Exception as e:
            print(f"❌ Error in get_college_cutoffs: {e}")
            return []
    
    def compare_colleges(self, college_codes: List[str], branch: str, category: str) -> Dict:
        """
        Compare multiple colleges for specific branch and category
        Uses normalized branch names and handles fallback to individual files
        """
        try:
            comparison_data = self.comparator.compare_colleges(
                college_codes,
                branch,
                category
            )
            
            return comparison_data
            
        except Exception as e:
            print(f"❌ Error in compare_colleges: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def get_recommendations(self, rank: int, category: str, preferences: Dict = None) -> List[Dict]:
        """Get college recommendations based on rank"""
        try:
            df = (self.comparator.merged_data if not self.comparator.merged_data.empty 
                  else self.comparator.individual_data)
            
            if df.empty:
                return []
            
            # Get colleges where user's rank is within range (with buffer)
            buffer = 5000
            df_filtered = df[
                (df['category'] == category) &
                (df['closing_rank'] >= rank - buffer) &
                (df['closing_rank'] <= rank + buffer)
            ].copy()
            
            # Apply preferences
            if preferences:
                if preferences.get('city'):
                    df_filtered = df_filtered[
                        df_filtered['city'].str.contains(preferences['city'], case=False, na=False)
                    ]
                
                if preferences.get('branch'):
                    branch_normalized = self.comparator.normalize_branch(preferences['branch'])
                    df_filtered = df_filtered[
                        df_filtered['branch_name'].apply(self.comparator.normalize_branch) == branch_normalized
                    ]
                
                if preferences.get('college_type'):
                    df_filtered = df_filtered[
                        df_filtered['type'].apply(self.comparator.normalize_college_type) == preferences['college_type']
                    ]
            
            # Get latest year data
            latest_year = df_filtered['year'].max() if len(df_filtered) > 0 else '2025'
            df_latest = df_filtered[df_filtered['year'] == latest_year]
            
            # Sort by closing rank
            df_latest = df_latest.sort_values('closing_rank')
            
            # Get unique colleges
            df_unique = df_latest.drop_duplicates(subset=['college_code'], keep='first').copy()
            
            # Add URLs
            df_unique['college_url'] = df_unique['college_code'].astype(str).map(
                self.comparator.college_urls
            )
            
            return df_unique.head(20).to_dict('records')
            
        except Exception as e:
            print(f"❌ Error in get_recommendations: {e}")
            return []
    
    def get_unique_cities(self) -> List[str]:
        """Get all unique cities"""
        try:
            return self.comparator.get_available_cities()
        except Exception as e:
            print(f"❌ Error in get_unique_cities: {e}")
            return []
    
    def get_unique_branches(self) -> List[str]:
        """Get all unique NORMALIZED branches"""
        try:
            return self.comparator.get_available_branches()
        except Exception as e:
            print(f"❌ Error in get_unique_branches: {e}")
            return []
    
    def get_unique_categories(self) -> List[str]:
        """Get all unique categories"""
        try:
            return self.comparator.get_available_categories()
        except Exception as e:
            print(f"❌ Error in get_unique_categories: {e}")
            return []
    
    def get_college_types(self) -> List[str]:
        """Get normalized college types"""
        try:
            return self.comparator.get_college_types()
        except Exception as e:
            print(f"❌ Error in get_college_types: {e}")
            return []
    
    def get_cutoff_trends(self, college_code: str, branch: str, category: str) -> List[Dict]:
        """Get cutoff trends over years with normalized branch"""
        try:
            data = self.comparator.get_college_data(college_code, branch, category)
            
            # Extract only relevant fields for trends
            trends = []
            for record in data:
                trends.append({
                    'year': record.get('year'),
                    'closing_rank': record.get('closing_rank'),
                    'closing_percentile': record.get('closing_percentile'),
                    'cap_round': record.get('cap_round', record.get('round', 1)),
                    'branch_normalized': record.get('branch_normalized'),
                    'category_normalized': record.get('category_normalized')
                })
            
            return trends
            
        except Exception as e:
            print(f"❌ Error in get_cutoff_trends: {e}")
            return []
    
    def get_college_stats(self, college_code: str) -> Dict:
        """Get statistics for a college"""
        try:
            stats = self.comparator.get_college_stats(college_code)
            return stats
        except Exception as e:
            print(f"❌ Error in get_college_stats: {e}")
            return {}
    
    def get_trend_analysis(self, college_code: str, branch: str, category: str) -> Dict:
        """Get detailed trend analysis"""
        try:
            analysis = self.comparator.get_trend_analysis(college_code, branch, category)
            return analysis
        except Exception as e:
            print(f"❌ Error in get_trend_analysis: {e}")
            return {}
    
    def get_category_info(self, category_code: str) -> Dict:
        """Get display information for a category"""
        try:
            return {
                'code': category_code,
                'display_name': self.comparator.get_category_display_name(category_code),
                'description': self.comparator.get_category_description(category_code),
                'normalized_group': self.comparator.normalize_category(category_code)
            }
        except Exception as e:
            print(f"❌ Error in get_category_info: {e}")
            return {}