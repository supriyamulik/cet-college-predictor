# D:\CET_Prediction\cet-web-app\backend\services\college_comparison_service.py

import pandas as pd
import os
from typing import List, Dict, Optional

class CollegeComparisonService:
    def __init__(self):
        # Load the merged cutoff data
        data_path = os.path.join('data', 'merged_cutoff_2021_2025.csv')
        
        # Try different paths
        if not os.path.exists(data_path):
            data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'merged_cutoff_2021_2025.csv')
        
        if not os.path.exists(data_path):
            print(f"⚠️  Warning: Could not find merged_cutoff_2021_2025.csv")
            print(f"   Tried paths:")
            print(f"   - data/merged_cutoff_2021_2025.csv")
            print(f"   - {os.path.join(os.path.dirname(__file__), '..', 'data', 'merged_cutoff_2021_2025.csv')}")
            # Create empty dataframe as fallback
            self.df = pd.DataFrame()
        else:
            print(f"✅ Loading comparison data from: {data_path}")
            self.df = pd.read_csv(data_path)
            # Convert year to string for consistency
            self.df['year'] = self.df['year'].astype(str)
            print(f"✅ Loaded {len(self.df)} comparison records")
        
    def get_all_colleges(self, filters: Dict = None) -> List[Dict]:
        """Get all colleges with optional filters"""
        if self.df.empty:
            return []
            
        df_filtered = self.df.copy()
        
        if filters:
            if filters.get('city'):
                df_filtered = df_filtered[df_filtered['city'] == filters['city']]
            if filters.get('type'):
                df_filtered = df_filtered[df_filtered['type'].str.contains(filters['type'], na=False)]
            if filters.get('branch'):
                df_filtered = df_filtered[df_filtered['branch_name'] == filters['branch']]
            if filters.get('category'):
                df_filtered = df_filtered[df_filtered['category'] == filters['category']]
            if filters.get('year'):
                df_filtered = df_filtered[df_filtered['year'] == filters['year']]
        
        # Get unique colleges (latest year data)
        latest_year = df_filtered['year'].max() if len(df_filtered) > 0 else '2025'
        df_latest = df_filtered[df_filtered['year'] == latest_year]
        
        # Drop duplicates based on college_code
        df_unique = df_latest.drop_duplicates(subset=['college_code'], keep='first')
        
        return df_unique.to_dict('records')
    
    def search_colleges(self, query: str, filters: Dict = None) -> List[Dict]:
        """Search colleges by name"""
        if self.df.empty:
            return []
            
        df_filtered = self.df.copy()
        
        # Apply search query
        if query:
            df_filtered = df_filtered[
                df_filtered['college_name'].str.contains(query, case=False, na=False)
            ]
        
        # Apply filters
        if filters:
            if filters.get('city'):
                df_filtered = df_filtered[df_filtered['city'] == filters['city']]
            if filters.get('type'):
                df_filtered = df_filtered[df_filtered['type'].str.contains(filters['type'], na=False)]
            if filters.get('branch'):
                df_filtered = df_filtered[df_filtered['branch_name'] == filters['branch']]
            if filters.get('category'):
                df_filtered = df_filtered[df_filtered['category'] == filters['category']]
            if filters.get('year'):
                df_filtered = df_filtered[df_filtered['year'] == filters['year']]
        
        # Get unique colleges
        latest_year = df_filtered['year'].max() if len(df_filtered) > 0 else '2025'
        df_latest = df_filtered[df_filtered['year'] == latest_year]
        df_unique = df_latest.drop_duplicates(subset=['college_code'], keep='first')
        
        return df_unique.to_dict('records')
    
    def get_college_by_code(self, college_code: str) -> Optional[Dict]:
        """Get specific college details"""
        if self.df.empty:
            return None
            
        df_college = self.df[self.df['college_code'] == int(college_code)]
        
        if len(df_college) == 0:
            return None
        
        # Get the latest year data
        latest = df_college.sort_values('year', ascending=False).iloc[0]
        return latest.to_dict()
    
    def get_college_cutoffs(self, college_code: str, filters: Dict = None) -> List[Dict]:
        """Get cutoff data for a specific college"""
        if self.df.empty:
            return []
            
        df_college = self.df[self.df['college_code'] == int(college_code)]
        
        if filters:
            if filters.get('branch'):
                df_college = df_college[df_college['branch_name'] == filters['branch']]
            if filters.get('category'):
                df_college = df_college[df_college['category'] == filters['category']]
            if filters.get('year'):
                df_college = df_college[df_college['year'] == filters['year']]
        
        return df_college.to_dict('records')
    
    def compare_colleges(self, college_codes: List[str], branch: str, category: str) -> Dict:
        """Compare multiple colleges for a specific branch and category"""
        if self.df.empty:
            return {}
            
        comparison_data = {}
        
        for college_code in college_codes:
            df_college = self.df[
                (self.df['college_code'] == int(college_code)) &
                (self.df['branch_name'] == branch) &
                (self.df['category'] == category)
            ]
            
            # Sort by year
            df_college = df_college.sort_values('year')
            comparison_data[college_code] = df_college.to_dict('records')
        
        return comparison_data
    
    def get_recommendations(self, rank: int, category: str, preferences: Dict = None) -> List[Dict]:
        """Get college recommendations based on rank"""
        if self.df.empty:
            return []
            
        # Get colleges where user's rank is within range (with buffer)
        buffer = 5000
        df_filtered = self.df[
            (self.df['category'] == category) &
            (self.df['closing_rank'] >= rank - buffer) &
            (self.df['closing_rank'] <= rank + buffer)
        ]
        
        # Apply preferences
        if preferences:
            if preferences.get('city'):
                df_filtered = df_filtered[df_filtered['city'] == preferences['city']]
            if preferences.get('branch'):
                df_filtered = df_filtered[df_filtered['branch_name'] == preferences['branch']]
            if preferences.get('college_type'):
                df_filtered = df_filtered[df_filtered['type'].str.contains(preferences['college_type'], na=False)]
        
        # Get latest year data
        latest_year = df_filtered['year'].max() if len(df_filtered) > 0 else '2025'
        df_latest = df_filtered[df_filtered['year'] == latest_year]
        
        # Sort by closing rank
        df_latest = df_latest.sort_values('closing_rank')
        
        # Get unique colleges
        df_unique = df_latest.drop_duplicates(subset=['college_code'], keep='first')
        
        return df_unique.head(20).to_dict('records')
    
    def get_unique_cities(self) -> List[str]:
        """Get all unique cities"""
        if self.df.empty:
            return []
        cities = self.df['city'].dropna().unique().tolist()
        return sorted(cities)
    
    def get_unique_branches(self) -> List[str]:
        """Get all unique branches"""
        if self.df.empty:
            return []
        branches = self.df['branch_name'].dropna().unique().tolist()
        return sorted(branches)
    
    def get_cutoff_trends(self, college_code: str, branch: str, category: str) -> List[Dict]:
        """Get cutoff trends over years"""
        if self.df.empty:
            return []
            
        df_trends = self.df[
            (self.df['college_code'] == int(college_code)) &
            (self.df['branch_name'] == branch) &
            (self.df['category'] == category)
        ]
        
        df_trends = df_trends.sort_values('year')
        return df_trends[['year', 'closing_rank', 'closing_percentile', 'cap_round']].to_dict('records')
    
    def get_college_stats(self, college_code: str) -> Dict:
        """Get statistics for a college"""
        if self.df.empty:
            return {}
            
        df_college = self.df[self.df['college_code'] == int(college_code)]
        
        if len(df_college) == 0:
            return {}
        
        stats = {
            'total_branches': int(df_college['branch_name'].nunique()),
            'available_categories': df_college['category'].unique().tolist(),
            'years_of_data': df_college['year'].unique().tolist(),
            'avg_closing_rank': int(df_college['closing_rank'].mean()),
            'min_closing_rank': int(df_college['closing_rank'].min()),
            'max_closing_rank': int(df_college['closing_rank'].max())
        }
        
        return stats