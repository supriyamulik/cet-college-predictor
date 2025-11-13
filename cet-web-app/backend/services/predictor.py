import joblib
import pandas as pd
import numpy as np
import os
from typing import List, Dict, Optional


class CollegePredictor:
    """
    College Predictor with REALISTIC GAP FILTERING
    - Top colleges: User percentile + (3 to 6) range
    - Moderate colleges: User percentile ± 2 range
    - Backup colleges: User percentile - (3 to 10) range
    """

    def __init__(self,
                 model_path: str = os.path.join('model', 'xgb_cap_model.pkl'),
                 data_path: str = os.path.join('data', 'flattened_CAP_data done.xlsx'),
                 college_list_path: str = os.path.join('data', 'unique_colleges_with_city_CAP1_2025.xlsx')):
        try:
            # Load XGBoost model
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                print("✅ XGBoost model loaded successfully!")
            else:
                raise FileNotFoundError(f"Model file not found: {model_path}")

            # Load main college dataframe
            if os.path.exists(data_path):
                self.college_data = pd.read_excel(data_path)
                print(f"✅ College data loaded: {len(self.college_data)} records")
            else:
                raise FileNotFoundError(f"College data file not found: {data_path}")

            # Load college list
            if os.path.exists(college_list_path):
                self.college_list = pd.read_excel(college_list_path)
                print(f"✅ College list loaded: {len(self.college_list)} colleges")
            else:
                self.college_list = pd.DataFrame()

            # Type weight mapping
            self.type_weight_mapping = {
                "Government": 1.00,
                "Autonomous / Government": 0.95,
                "State Technological University": 0.90,
                "University Department": 0.85,
                "Autonomous / Aided": 0.80,
                "Autonomous / Private": 0.75,
                "Deemed University": 0.70,
                "State Private University": 0.65,
                "Private (Unaided)": 0.60,
                "Deemed University (Off-Campus)": 0.55
            }

            self.college_data['Type_Weight'] = self.college_data['type'].map(
                self.type_weight_mapping
            ).fillna(0.6)

            # Normalize closing percentile
            self.min_cutoff = self.college_data['closing_percentile'].min()
            self.max_cutoff = self.college_data['closing_percentile'].max()
            
            self.college_data['C_normalized'] = (
                (self.college_data['closing_percentile'] - self.min_cutoff) / 
                (self.max_cutoff - self.min_cutoff)
            )

            # Extract unique values
            self.available_branches = sorted(
                self.college_data['branch_name'].dropna().unique().tolist()
            )
            self.available_cities = sorted(
                self.college_data['city'].dropna().unique().tolist()
            )
            self.available_categories = sorted(
                self.college_data['category'].dropna().unique().tolist()
            )

            print(f"🎓 Branches: {len(self.available_branches)}")
            print(f"🏙️ Cities: {len(self.available_cities)}")
            print(f"📊 Categories: {len(self.available_categories)}")
            print(f"📉 Cutoff range: {self.min_cutoff:.2f}% - {self.max_cutoff:.2f}%")

        except Exception as e:
            print(f"❌ Error initializing predictor: {e}")
            import traceback
            traceback.print_exc()
            raise


    def predict_colleges(self,
                        rank: int,
                        percentile: float,
                        category: str = 'OPEN',
                        city: Optional[str] = None,
                        branch: Optional[str] = None,
                        limit: int = 100) -> List[Dict]:
        """
        Predict colleges with REALISTIC GAP FILTERING
        
        LOGIC:
        1. Filter colleges by percentile ranges:
           - Top: user_percentile + 3 to + 6
           - Moderate: user_percentile - 2 to + 2
           - Backup: user_percentile - 10 to - 3
        2. Sort by closeness to user percentile
        3. Within same closeness, sort by college quality (historical cutoff)
        """
        try:
            print(f"\n{'='*60}")
            print(f"🎯 PREDICTION WITH GAP FILTERING")
            print(f"{'='*60}")
            print(f"Percentile: {percentile}% | Rank: {rank} | Category: {category}")
            print(f"City: {city or 'All'} | Branch: {branch or 'All'}")
            print(f"{'='*60}\n")

            # Start with full dataset
            filtered_df = self.college_data.copy()

            # === APPLY FILTERS ===
            if category:
                category_upper = category.strip().upper()
                filtered_df = filtered_df[
                    filtered_df['category'].str.contains(category_upper, case=False, na=False)
                ]
                print(f"✅ After category filter: {len(filtered_df)} records")

            if city:
                filtered_df = filtered_df[
                    filtered_df['city'].str.contains(city, case=False, na=False)
                ]
                print(f"✅ After city filter: {len(filtered_df)} records")

            if branch:
                filtered_df = filtered_df[
                    filtered_df['branch_name'].str.contains(branch, case=False, na=False)
                ]
                print(f"✅ After branch filter: {len(filtered_df)} records")

            if filtered_df.empty:
                print("⚠️ No colleges found. Showing overall recommendations.")
                filtered_df = self.college_data.copy()

            # === ML PREDICTION ===
            X_test = filtered_df[['C_normalized', 'Type_Weight']]
            filtered_df['Predicted_Percentile'] = self.model.predict(X_test)

            # Normalize predictions
            pred_min = filtered_df['Predicted_Percentile'].min()
            pred_max = filtered_df['Predicted_Percentile'].max()
            
            if pred_max > pred_min:
                filtered_df['Predicted_Percentile'] = (
                    (filtered_df['Predicted_Percentile'] - pred_min) / 
                    (pred_max - pred_min)
                ) * 100
            else:
                filtered_df['Predicted_Percentile'] = 50.0

            # === CALCULATE GAP ===
            filtered_df['percentile_gap'] = percentile - filtered_df['Predicted_Percentile']

            # === APPLY REALISTIC GAP FILTERING ===
            # Top colleges: +3 to +6 range (slightly higher than user)
            # Moderate: -2 to +2 range (around user's level)
            # Backup: -10 to -3 range (below user's level)
            
            print(f"\n🎯 APPLYING GAP FILTER:")
            print(f"   Top Colleges: {percentile + 3}% to {percentile + 6}% range")
            print(f"   Moderate: {percentile - 2}% to {percentile + 2}% range")
            print(f"   Backup: {percentile - 10}% to {percentile - 3}% range")
            
            # Filter based on realistic ranges
            realistic_df = filtered_df[
                # Top colleges (aspirational but realistic)
                ((filtered_df['Predicted_Percentile'] >= percentile + 3) & 
                 (filtered_df['Predicted_Percentile'] <= percentile + 6)) |
                # Moderate colleges (perfect match)
                ((filtered_df['Predicted_Percentile'] >= percentile - 2) & 
                 (filtered_df['Predicted_Percentile'] <= percentile + 2)) |
                # Backup colleges (safety net)
                ((filtered_df['Predicted_Percentile'] >= percentile - 10) & 
                 (filtered_df['Predicted_Percentile'] <= percentile - 3))
            ].copy()

            print(f"\n✅ After gap filtering: {len(realistic_df)} colleges (removed unrealistic matches)")

            if realistic_df.empty:
                print("⚠️ No colleges in realistic range. Relaxing filter...")
                # Fallback: allow ±10 range if no colleges found
                realistic_df = filtered_df[
                    (filtered_df['Predicted_Percentile'] >= percentile - 10) & 
                    (filtered_df['Predicted_Percentile'] <= percentile + 10)
                ].copy()
                print(f"   Relaxed filter: {len(realistic_df)} colleges")

            # === CALCULATE PROBABILITY BASED ON GAP ===
            def calculate_probability(gap):
                # More realistic probability calculation
                if gap >= 5:      # Way above (top colleges)
                    return 90.0
                elif gap >= 3:    # Above (stretch colleges)
                    return 80.0
                elif gap >= 0:    # At or slightly above
                    return 70.0
                elif gap >= -2:   # Slightly below (moderate)
                    return 60.0
                elif gap >= -5:   # Below (backup)
                    return 50.0
                else:             # Well below (safety)
                    return 40.0

            realistic_df['admission_probability'] = realistic_df['percentile_gap'].apply(
                calculate_probability
            )

            # === CATEGORIZE ===
            def categorize(prob):
                if prob >= 70:
                    return "HIGH"
                elif prob >= 50:
                    return "MODERATE"
                else:
                    return "BACKUP"

            realistic_df['category_tag'] = realistic_df['admission_probability'].apply(categorize)

            # === CALCULATE CLOSENESS (for sorting) ===
            realistic_df['closeness'] = abs(percentile - realistic_df['Predicted_Percentile'])

            # === DEDUPLICATE BY COLLEGE (Keep best branch per college) ===
            realistic_df = realistic_df.sort_values(
                by=['closeness', 'closing_percentile', 'Type_Weight'],
                ascending=[True, False, False]
            )
            
            recommendations = realistic_df.groupby('college_name', as_index=False).first()

            # === FINAL SORT: Closeness first, then quality ===
            recommendations = recommendations.sort_values(
                by=['closeness', 'closing_percentile', 'Type_Weight'],
                ascending=[True, False, False]
            )

            print(f"\n📊 FILTERED RESULTS:")
            high_prob = recommendations[recommendations['admission_probability'] >= 70]
            mod_prob = recommendations[(recommendations['admission_probability'] >= 50) & 
                                      (recommendations['admission_probability'] < 70)]
            low_prob = recommendations[recommendations['admission_probability'] < 50]
            
            print(f"✅ HIGH (70%+): {len(high_prob)} colleges")
            print(f"🔵 MODERATE (50-69%): {len(mod_prob)} colleges")
            print(f"🟠 BACKUP (<50%): {len(low_prob)} colleges")

            # === BUILD RESULT LIST ===
            results = []
            for idx, (_, row) in enumerate(recommendations.head(limit).iterrows(), 1):
                result = {
                    'rank': idx,
                    'college_name': str(row['college_name']),
                    'branch': str(row['branch_name']),
                    'branch_code': str(row.get('branch_code', 'N/A')),
                    'city': str(row['city']),
                    'type': str(row['type']),
                    
                    # ML predictions
                    'predicted_cutoff': round(float(row['Predicted_Percentile']), 2),
                    'historical_cutoff': round(float(row['closing_percentile']), 2),
                    'cutoff_rank': int(row['closing_rank']) if pd.notna(row.get('closing_rank')) else None,
                    
                    'admission_probability': round(float(row['admission_probability']), 2),
                    'percentile_gap': round(float(row['percentile_gap']), 2),
                    'closeness': round(float(row['closeness']), 2),
                    
                    # Category
                    'category': str(row['category_tag']),
                    'category_emoji': self.get_category_emoji(row['category_tag']),
                    
                    # Metadata
                    'quota_category': str(row.get('category', 'N/A')),
                    'round': int(row.get('round', 1)),
                    'ml_model': 'XGBoost (Gap Filtered)'
                }
                results.append(result)

            # Print top 10
            print(f"\n📋 TOP 10 MATCHES (Closest to {percentile}%):")
            print(f"{'#':<5}{'College':<40}{'Pred%':<8}{'Gap':<8}{'Prob%'}")
            print("="*70)
            for r in results[:10]:
                college_short = r['college_name'][:38]
                print(f"{r['rank']:<5}{college_short:<40}{r['predicted_cutoff']:<8.2f}{r['percentile_gap']:<8.2f}{r['admission_probability']:.1f}%")

            print(f"\n✅ Total: {len(results)} realistic matches")
            print(f"{'='*60}\n")

            return results

        except Exception as e:
            print(f"❌ Prediction error: {e}")
            import traceback
            traceback.print_exc()
            return []


    def predict_multiple_branches(self,
                                  rank: int,
                                  percentile: float,
                                  category: str,
                                  branches: List[str],
                                  city: Optional[str] = None,
                                  limit: int = 100) -> List[Dict]:
        """Predict for multiple branches with gap filtering"""
        all_results = []
        
        for branch in branches:
            results = self.predict_colleges(
                rank=rank,
                percentile=percentile,
                category=category,
                city=city,
                branch=branch,
                limit=limit
            )
            all_results.extend(results)
        
        # Deduplicate by branch_code
        seen = set()
        unique_results = []
        for r in all_results:
            key = r['branch_code']
            if key not in seen:
                seen.add(key)
                unique_results.append(r)
        
        # Sort by closeness first, then quality
        unique_results.sort(key=lambda x: (x['closeness'], -x['historical_cutoff']))
        
        # Re-assign ranks
        for idx, r in enumerate(unique_results, 1):
            r['rank'] = idx
        
        return unique_results[:limit]


    def get_category_emoji(self, category: str) -> str:
        emojis = {
            "HIGH": "🟢",
            "MODERATE": "🔵",
            "BACKUP": "🟠"
        }
        return emojis.get(category, "⚪")


    def get_statistics(self, predictions: List[Dict]) -> Dict:
        if not predictions:
            return {
                'total': 0,
                'high': {'count': 0, 'percentage': 0},
                'moderate': {'count': 0, 'percentage': 0},
                'backup': {'count': 0, 'percentage': 0},
                'avg_probability': 0
            }

        high = [p for p in predictions if p['category'] == 'HIGH']
        moderate = [p for p in predictions if p['category'] == 'MODERATE']
        backup = [p for p in predictions if p['category'] == 'BACKUP']

        probabilities = [p['admission_probability'] for p in predictions]
        
        return {
            'total': len(predictions),
            'high': {
                'count': len(high),
                'percentage': round(len(high) / len(predictions) * 100, 1)
            },
            'moderate': {
                'count': len(moderate),
                'percentage': round(len(moderate) / len(predictions) * 100, 1)
            },
            'backup': {
                'count': len(backup),
                'percentage': round(len(backup) / len(predictions) * 100, 1)
            },
            'avg_probability': round(sum(probabilities) / len(probabilities), 2),
            'highest_probability': max(probabilities),
            'lowest_probability': min(probabilities)
        }


    def get_college_info(self) -> Dict:
        return {
            'total_records': len(self.college_data),
            'total_colleges': self.college_data['college_name'].nunique(),
            'total_branches': len(self.available_branches),
            'total_cities': len(self.available_cities),
            'available_branches': self.available_branches[:20],
            'available_cities': self.available_cities[:20],
            'available_categories': self.available_categories
        }