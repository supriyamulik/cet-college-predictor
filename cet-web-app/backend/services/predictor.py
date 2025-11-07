import joblib
import pandas as pd
import numpy as np
import os
from typing import List, Dict, Optional

class CollegePredictor:
    def __init__(self):
        """Initialize and load the trained XGBoost model and data"""
        try:
            # Load XGBoost model
            model_path = os.path.join('model', 'xgb_cap_model.pkl')
            self.model = joblib.load(model_path)
            print("✅ XGBoost model loaded successfully!")
            
            # Load flattened college data (historical cutoffs)
            data_path = os.path.join('data', 'flattened_CAP_data done.xlsx')
            self.college_data = pd.read_excel(data_path)
            print(f"✅ College data loaded: {len(self.college_data)} records")
            
            # Load college list with additional info
            college_list_path = os.path.join('data', 'unique_colleges_with_city_CAP1_2025.xlsx')
            self.college_list = pd.read_excel(college_list_path)
            print(f"✅ College list loaded: {len(self.college_list)} colleges")
            
            # YOUR ACTUAL COLUMNS (from image):
            # college_name, branch_code, branch_name, category, closing_rank, closing_percentile, year, city, type
            
            print(f"📊 Columns in college_data: {list(self.college_data.columns)}")
            
            # Get unique values for filters
            self.available_branches = sorted(self.college_data['branch_name'].dropna().unique().tolist())
            self.available_cities = sorted(self.college_data['city'].dropna().unique().tolist())
            
            print(f"🎓 Total branches available: {len(self.available_branches)}")
            print(f"🏙️ Total cities available: {len(self.available_cities)}")
            
            if len(self.available_branches) > 0:
                print(f"📚 Sample branches: {self.available_branches[:5]}")
            if len(self.available_cities) > 0:
                print(f"🌆 Sample cities: {self.available_cities[:5]}")
            
        except Exception as e:
            print(f"❌ Error loading model/data: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def get_college_info(self) -> Dict:
        """Get basic info about loaded data"""
        return {
            'total_records': len(self.college_data),
            'total_colleges': len(self.college_list),
            'total_branches': len(self.available_branches),
            'total_cities': len(self.available_cities),
            'available_branches': self.available_branches[:30],
            'available_cities': self.available_cities[:30],
            'columns': list(self.college_data.columns)
        }
    
    def calculate_admission_probability(self, user_percentile: float, cutoff_percentile: float, 
                                       user_rank: int = None, cutoff_rank: int = None) -> float:
        """
        Calculate admission probability based on percentile comparison
        """
        try:
            # Handle NaN/None values
            if pd.isna(cutoff_percentile) or cutoff_percentile == 0:
                if user_rank and cutoff_rank and not pd.isna(cutoff_rank) and cutoff_rank > 0:
                    rank_diff_percent = ((cutoff_rank - user_rank) / cutoff_rank) * 100
                    if rank_diff_percent > 20:
                        return 95.0
                    elif rank_diff_percent > 10:
                        return 85.0
                    elif rank_diff_percent > 0:
                        return 70.0
                    elif rank_diff_percent > -10:
                        return 50.0
                    else:
                        return 30.0
                else:
                    return 50.0
            
            # Percentile-based calculation
            percentile_diff = user_percentile - cutoff_percentile
            
            if percentile_diff >= 5:
                probability = min(100, 95 + (percentile_diff - 5))
            elif percentile_diff >= 2:
                probability = 80 + (percentile_diff - 2) * 5
            elif percentile_diff >= 0:
                probability = 70 + percentile_diff * 5
            elif percentile_diff >= -2:
                probability = 50 + (percentile_diff + 2) * 10
            elif percentile_diff >= -5:
                probability = 30 + (percentile_diff + 5) * 6.67
            else:
                probability = max(5, 30 + (percentile_diff + 5) * 5)
            
            probability = max(0, min(100, probability))
            return round(probability, 2)
            
        except Exception as e:
            print(f"Error calculating probability: {e}")
            return 50.0
    
    def categorize_college(self, probability: float) -> str:
        """Categorize college as DREAM, TARGET, or SAFE"""
        if probability >= 80:
            return "SAFE"
        elif probability >= 50:
            return "TARGET"
        else:
            return "DREAM"
    
    def get_category_emoji(self, category: str) -> str:
        """Get emoji for category"""
        emojis = {
            "DREAM": "🟠",
            "TARGET": "🔵",
            "SAFE": "🟢"
        }
        return emojis.get(category, "⚪")
    
    def predict_colleges(self, rank: int, percentile: float, category: str, 
                        city: Optional[str] = None, branch: Optional[str] = None,
                        limit: int = 50) -> List[Dict]:
        """
        Predict eligible colleges based on student profile
        
        YOUR DATA COLUMNS:
        - college_name
        - branch_code  
        - branch_name
        - category (OPEN, OBC, GOPEN, GOPENS, etc.)
        - closing_rank
        - closing_percentile
        - year (2025)
        - city
        - type (Government, etc.)
        """
        try:
            df = self.college_data.copy()
            
            print(f"\n🔍 Starting prediction with {len(df)} records")
            print(f"📊 Input: Rank={rank}, Percentile={percentile}, Category={category}")
            
            # Filter by category
            # Your categories: GOPENS, GOPEN, GOBC, etc.
            # User input: OPEN, OBC, SC, ST
            
            # Map user category to your data format
            if category.upper() == 'OPEN':
                # Match OPEN, GOPEN, GOPENS, etc.
                df = df[df['category'].str.contains('OPEN', case=False, na=False)]
            elif category.upper() == 'OBC':
                df = df[df['category'].str.contains('OBC', case=False, na=False)]
            elif category.upper() == 'SC':
                df = df[df['category'].str.contains('SC', case=False, na=False)]
            elif category.upper() == 'ST':
                df = df[df['category'].str.contains('ST', case=False, na=False)]
            elif category.upper() == 'EWS':
                df = df[df['category'].str.contains('EWS', case=False, na=False)]
            elif category.upper() == 'TFWS':
                df = df[df['category'].str.contains('TFWS', case=False, na=False)]
            else:
                # Exact match
                df = df[df['category'].str.upper() == category.upper()]
            
            print(f"✅ After category filter ({category}): {len(df)} records")
            
            # Filter by city if provided
            if city:
                df = df[df['city'].str.contains(city, case=False, na=False)]
                print(f"✅ After city filter ({city}): {len(df)} records")
            
            # Filter by branch if provided
            if branch:
                df = df[df['branch_name'].str.contains(branch, case=False, na=False)]
                print(f"✅ After branch filter ({branch}): {len(df)} records")
            
            if len(df) == 0:
                print("⚠️ No colleges found matching filters")
                return []
            
            # Calculate admission probabilities
            results = []
            
            for idx, row in df.iterrows():
                try:
                    # Get cutoff data from YOUR columns
                    cutoff_percentile = row.get('closing_percentile', 0)
                    cutoff_rank = row.get('closing_rank', 0)
                    
                    # Skip if no cutoff data
                    if pd.isna(cutoff_percentile) or cutoff_percentile == 0:
                        continue
                    
                    # Calculate probability
                    probability = self.calculate_admission_probability(
                        user_percentile=percentile,
                        cutoff_percentile=cutoff_percentile,
                        user_rank=rank,
                        cutoff_rank=cutoff_rank
                    )
                    
                    # Categorize
                    college_category = self.categorize_college(probability)
                    
                    # Build result object using YOUR column names
                    result = {
                        'college_name': row.get('college_name', 'Unknown'),
                        'branch': row.get('branch_name', 'Unknown'),
                        'branch_code': row.get('branch_code', 'N/A'),
                        'city': row.get('city', 'Unknown'),
                        'type': row.get('type', 'Unknown'),
                        'admission_probability': probability,
                        'category': college_category,
                        'category_emoji': self.get_category_emoji(college_category),
                        
                        # Historical data
                        'cutoff_2024': cutoff_percentile,
                        'cutoff_rank_2024': cutoff_rank if not pd.isna(cutoff_rank) else 'N/A',
                        'percentile_gap': round(percentile - cutoff_percentile, 2),
                        
                        # Additional info
                        'quota_category': row.get('category', 'N/A'),
                        'year': row.get('year', 2025)
                    }
                    
                    results.append(result)
                    
                except Exception as e:
                    print(f"⚠️ Error processing row {idx}: {e}")
                    continue
            
            # Sort by probability (highest first)
            results.sort(key=lambda x: x['admission_probability'], reverse=True)
            
            print(f"✅ Prediction complete: {len(results)} colleges found")
            
            if len(results) > 0:
                print(f"\n🏆 Top 3 Results:")
                for i, r in enumerate(results[:3], 1):
                    print(f"{i}. {r['college_name']} - {r['branch']}")
                    print(f"   Probability: {r['admission_probability']}% | Category: {r['category']}")
            
            return results[:limit]
            
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def predict_multiple_branches(self, rank: int, percentile: float, category: str,
                                  branches: List[str], city: Optional[str] = None,
                                  limit: int = 50) -> List[Dict]:
        """Predict colleges for multiple branches"""
        all_results = []
        
        print(f"\n🔄 Predicting for {len(branches)} branches")
        
        for branch in branches:
            print(f"\n{'='*50}")
            print(f"🔍 Predicting for branch: {branch}")
            print(f"{'='*50}")
            
            results = self.predict_colleges(
                rank=rank,
                percentile=percentile,
                category=category,
                city=city,
                branch=branch,
                limit=limit
            )
            all_results.extend(results)
        
        print(f"\n📊 Total results before deduplication: {len(all_results)}")
        
        # Remove duplicates
        unique_results = []
        seen = set()
        
        for result in all_results:
            key = f"{result['college_name']}_{result['branch']}"
            if key not in seen:
                seen.add(key)
                unique_results.append(result)
        
        print(f"📊 Total unique results: {len(unique_results)}")
        
        # Sort by probability
        unique_results.sort(key=lambda x: x['admission_probability'], reverse=True)
        
        return unique_results[:limit]
    
    def get_branch_suggestions(self, rank: int, percentile: float, category: str,
                              preferred_branch: str, city: Optional[str] = None) -> List[Dict]:
        """Suggest alternative branches with better admission chances"""
        try:
            preferred_results = self.predict_colleges(rank, percentile, category, city, preferred_branch, limit=10)
            
            if not preferred_results:
                return []
            
            avg_prob_preferred = sum(r['admission_probability'] for r in preferred_results) / len(preferred_results)
            
            suggestions = []
            
            # Common branch alternatives
            branch_alternatives = {
                'Computer': ['Information Technology', 'Electronics & Computer', 'Computer Science', 'AI'],
                'Information Technology': ['Computer', 'Electronics & Computer', 'Computer Science'],
                'Electronics': ['Electronics & Telecommunication', 'Electronics & Computer', 'EXTC'],
                'Mechanical': ['Automobile', 'Production', 'Industrial', 'Mechatronics'],
                'Civil': ['Construction Technology', 'Civil & Environmental'],
                'Electrical': ['Electronics', 'Instrumentation', 'Power Systems']
            }
            
            alternatives = []
            for key, alts in branch_alternatives.items():
                if key.lower() in preferred_branch.lower():
                    alternatives = alts
                    break
            
            if not alternatives:
                return []
            
            for alt_branch in alternatives:
                alt_results = self.predict_colleges(rank, percentile, category, city, alt_branch, limit=5)
                if alt_results:
                    avg_prob_alt = sum(r['admission_probability'] for r in alt_results) / len(alt_results)
                    if avg_prob_alt > avg_prob_preferred:
                        suggestions.append({
                            'branch': alt_branch,
                            'average_probability': round(avg_prob_alt, 2),
                            'improvement': round(avg_prob_alt - avg_prob_preferred, 2),
                            'top_colleges': [r['college_name'] for r in alt_results[:3]]
                        })
            
            return sorted(suggestions, key=lambda x: x['improvement'], reverse=True)
            
        except Exception as e:
            print(f"❌ Branch suggestion error: {e}")
            return []
    
    def get_statistics(self, predictions: List[Dict]) -> Dict:
        """Calculate statistics from predictions"""
        if not predictions:
            return {
                'total': 0,
                'dream': {'count': 0, 'percentage': 0},
                'target': {'count': 0, 'percentage': 0},
                'safe': {'count': 0, 'percentage': 0}
            }
        
        dream = [p for p in predictions if p['category'] == 'DREAM']
        target = [p for p in predictions if p['category'] == 'TARGET']
        safe = [p for p in predictions if p['category'] == 'SAFE']
        
        return {
            'total': len(predictions),
            'dream': {
                'count': len(dream),
                'percentage': round(len(dream) / len(predictions) * 100, 1)
            },
            'target': {
                'count': len(target),
                'percentage': round(len(target) / len(predictions) * 100, 1)
            },
            'safe': {
                'count': len(safe),
                'percentage': round(len(safe) / len(predictions) * 100, 1)
            },
            'avg_probability': round(sum(p['admission_probability'] for p in predictions) / len(predictions), 2),
            'highest_probability': max(p['admission_probability'] for p in predictions),
            'lowest_probability': min(p['admission_probability'] for p in predictions)
        }