import joblib
import pandas as pd
import numpy as np
import os
from typing import List, Dict, Optional

class CollegePredictor:
    """
    Enhanced College Predictor with:
    - REALISTIC GAP FILTERING (WIDENED)
    - Women-only college handling (COEP for males, Cummins for females)
    - Proper caste filtering (OPEN + specific caste seats)
    - Enhanced diagnostics
    """

    # Women-only college identifiers
    WOMEN_ONLY_KEYWORDS = ['women', 'mahila', 'stree', 'ladies', 'kanya', 'balika']
    
    # Category mapping for caste filtering
    CATEGORY_MAP = {
        'OPEN': ['GOPENS', 'GOPENH', 'LOPENS', 'LOPENH'],
        'OBC': ['GOBCS', 'GOBCO', 'GOBCH', 'LOBCS', 'LOBCO', 'LOBCH'],
        'SC': ['GSCS', 'GSCO', 'GSCH', 'LSCS', 'LSCO', 'LSCH'],
        'ST': ['GSTS', 'GSTO', 'GSTH', 'LSTS', 'LSTO', 'LSTH'],
        'NT1': ['GRNT1S', 'GRNT1H', 'LRNT1S', 'LRNT1H'],
        'NT2': ['GRNT2S', 'GRNT2H', 'LRNT2S', 'LRNT2H'],
        'NT3': ['GRNT3S', 'GRNT3H', 'LRNT3S', 'LRNT3H'],
        'VJ': ['GVJS', 'GVJH', 'LVJS', 'LVJH'],
        'EWS': ['GEWSS', 'GEWSH', 'LEWSS', 'LEWSH'],
        'DEF': ['DEFOPENS', 'DEFOBCS', 'DEFRNT1S', 'DEFRNT2S', 'DEFRNT3S'],
        'PWD': ['PWDOPENH', 'PWDOPENS', 'PWDOBCS', 'PWDOBCH', 'PWDRNT1S', 
                'PWDRNT2S', 'PWDRNT3S', 'PWDSEBCS', 'PWDSTS', 'PWDSCS', 'PWDSCH'],
        'TFWS': ['TFWS'],
        'MI': ['MI'],
        'ORPHAN': ['ORPHAN']
    }
    
    # Ladies-only categories (for gender filtering)
    # These are the actual ladies-only seats that males cannot apply for
    LADIES_ONLY_CATEGORIES = [
        'LOPENS', 'LOPENH',  # Ladies Open
        'LOBCS', 'LOBCO', 'LOBCH',  # Ladies OBC
        'LSCS', 'LSCO', 'LSCH',  # Ladies SC
        'LSTS', 'LSTO', 'LSTH',  # Ladies ST
        'LRNT1S', 'LRNT1H',  # Ladies NT1
        'LRNT2S', 'LRNT2H',  # Ladies NT2
        'LRNT3S', 'LRNT3H',  # Ladies NT3
        'LVJS', 'LVJH',  # Ladies VJ
        'LEWSS', 'LEWSH'  # Ladies EWS
    ]

    def __init__(self,
                 model_path: str = os.path.join('model', 'xgb_cap_model.pkl'),
                 data_path: str = os.path.join('data', 'flattened_CAP_data done.xlsx'),
                 college_list_path: str = os.path.join('data', 'unique_colleges_with_city_CAP1_2025.xlsx'),
                 cutoff_2025_path: str = r'D:\CET_Prediction\cet-web-app\backend\data\cutoff_trends\2025.csv'):
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

            # Load 2025 cutoff data if available
            if os.path.exists(cutoff_2025_path):
                self.cutoff_2025 = pd.read_csv(cutoff_2025_path)
                print(f"✅ 2025 cutoff data loaded: {len(self.cutoff_2025)} records")
            else:
                self.cutoff_2025 = None
                print("⚠️ 2025 cutoff data not found, using existing data only")

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
                "State Technological University": 0.75,
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
            
            # Diagnostic: Check for key colleges
            self._diagnostic_check_colleges()

        except Exception as e:
            print(f"❌ Error initializing predictor: {e}")
            import traceback
            traceback.print_exc()
            raise

    def _diagnostic_check_colleges(self):
        """Check if COEP and Cummins exist in dataset"""
        print(f"\n{'='*60}")
        print("🔍 DIAGNOSTIC: Checking for Key Colleges")
        print(f"{'='*60}")
        
        # Check COEP
        coep = self.college_data[
            self.college_data['college_name'].str.contains('COEP|College of Engineering.*Pune', 
                                                           case=False, na=False, regex=True)
        ]
        if len(coep) > 0:
            print(f"✅ COEP found: {len(coep)} records")
            print(f"   Name: {coep['college_name'].iloc[0]}")
            print(f"   Cutoff range: {coep['closing_percentile'].min():.1f}% - {coep['closing_percentile'].max():.1f}%")
            print(f"   Categories: {coep['category'].unique()[:5].tolist()}")
        else:
            print("❌ COEP not found in dataset!")
        
        # Check Cummins
        cummins = self.college_data[
            self.college_data['college_name'].str.contains('Cummins', case=False, na=False)
        ]
        if len(cummins) > 0:
            print(f"✅ Cummins found: {len(cummins)} records")
            print(f"   Name: {cummins['college_name'].iloc[0]}")
            print(f"   Women-only: {self._is_women_only_college(cummins.iloc[0]['college_name'])}")
            print(f"   Cutoff range: {cummins['closing_percentile'].min():.1f}% - {cummins['closing_percentile'].max():.1f}%")
            print(f"   Categories: {cummins['category'].unique()[:5].tolist()}")
        else:
            print("❌ Cummins not found in dataset!")
        
        print(f"{'='*60}\n")

    def _is_women_only_college(self, college_name: str) -> bool:
        """Check if college is women-only based on name"""
        if pd.isna(college_name):
            return False
        college_lower = str(college_name).lower()
        return any(keyword in college_lower for keyword in self.WOMEN_ONLY_KEYWORDS)

    def _get_allowed_categories(self, user_category: str, gender: str = None) -> List[str]:
        """
        Get allowed category codes based on user's category and gender.
        Logic: 
        - OPEN seats + specific caste seats
        - Males: Can apply to G-prefixed + DEF/PWD/TFWS/MI (NOT ladies-only L-categories)
        - Females: Can apply to ALL categories (G + L + DEF/PWD/TFWS/MI)
        
        Args:
            user_category: User's category (OPEN, OBC, SC, ST, DEF, PWD, etc.)
            gender: 'Male', 'Female', 'M', or 'F' (optional)
        
        Returns:
            List of allowed category codes
        """
        user_category_upper = user_category.strip().upper()
        
        # Normalize gender input (handle 'Male'/'Female' from frontend)
        gender_normalized = None
        if gender:
            gender_str = str(gender).strip().upper()
            if gender_str in ['M', 'MALE']:
                gender_normalized = 'M'
            elif gender_str in ['F', 'FEMALE']:
                gender_normalized = 'F'
        
        allowed = []
        
        # Add OPEN categories based on gender
        if gender_normalized == 'M':
            # Males: Only G-prefixed OPEN seats
            allowed.extend(['GOPENS', 'GOPENH'])
        else:
            # Females: All OPEN seats (G + L)
            allowed.extend(self.CATEGORY_MAP.get('OPEN', []))
        
        # Add specific category seats if not OPEN
        if user_category_upper != 'OPEN' and user_category_upper in self.CATEGORY_MAP:
            category_seats = self.CATEGORY_MAP[user_category_upper].copy()
            allowed.extend(category_seats)
        
        # CRITICAL: For males, remove ladies-only L-categories (but keep DEF/PWD/TFWS)
        if gender_normalized == 'M':
            # Filter out only the actual ladies-only categories
            allowed = [cat for cat in allowed if cat not in self.LADIES_ONLY_CATEGORIES]
        
        # Remove duplicates while preserving order
        seen = set()
        allowed = [x for x in allowed if not (x in seen or seen.add(x))]
        
        return allowed

    def predict_colleges(self,
                        rank: int,
                        percentile: float,
                        category: str = 'OPEN',
                        gender: Optional[str] = None,
                        city: Optional[str] = None,
                        branch: Optional[str] = None,
                        limit: int = 100) -> List[Dict]:
        """
        Predict colleges with ENHANCED FILTERING
        
        Args:
            rank: CET rank
            percentile: CET percentile
            category: User's category (OPEN, OBC, SC, ST, etc.)
            gender: 'Male', 'Female', 'M', or 'F' (for women-only college filtering)
            city: Preferred city
            branch: Preferred branch
            limit: Maximum results
        
        Returns:
            List of college predictions
        """
        try:
            print(f"\n{'='*60}")
            print(f"🎯 PREDICTION WITH ENHANCED FILTERING")
            print(f"{'='*60}")
            print(f"Percentile: {percentile}% | Rank: {rank} | Category: {category}")
            print(f"Gender: {gender or 'Not specified'} | City: {city or 'All'} | Branch: {branch or 'All'}")
            print(f"{'='*60}\n")

            # Normalize gender
            gender_normalized = None
            if gender:
                gender_str = str(gender).strip().upper()
                if gender_str in ['M', 'MALE']:
                    gender_normalized = 'M'
                elif gender_str in ['F', 'FEMALE']:
                    gender_normalized = 'F'

            # Start with full dataset
            filtered_df = self.college_data.copy()
            initial_count = len(filtered_df)

            # === GENDER & WOMEN-ONLY COLLEGE FILTERING ===
            if gender_normalized:
                if gender_normalized == 'M':
                    # MALES: Exclude women-only colleges
                    filtered_df = filtered_df[
                        ~filtered_df['college_name'].apply(self._is_women_only_college)
                    ]
                    # Exclude ladies-only category codes (specific L-categories, NOT all L-prefix)
                    filtered_df = filtered_df[
                        ~filtered_df['category'].isin(self.LADIES_ONLY_CATEGORIES)
                    ]
                    print(f"✅ MALE FILTER: {initial_count} → {len(filtered_df)} records")
                    print(f"   Excluded women-only colleges (Cummins, etc.)")
                    print(f"   Excluded ladies-only categories: {len(self.LADIES_ONLY_CATEGORIES)} types")
                
                elif gender_normalized == 'F':
                    # FEMALES: Include ALL colleges (no filtering)
                    print(f"✅ FEMALE FILTER: All {len(filtered_df)} records included")
                    print(f"   ✓ Women-only colleges (Cummins): INCLUDED")
                    print(f"   ✓ Co-ed colleges (COEP, etc.): INCLUDED")
                    print(f"   ✓ All category codes: INCLUDED")

            # === CATEGORY FILTERING (OPEN + Specific Caste) ===
            allowed_categories = self._get_allowed_categories(category, gender)
            
            if allowed_categories:
                before_cat = len(filtered_df)
                filtered_df = filtered_df[
                    filtered_df['category'].isin(allowed_categories)
                ]
                print(f"\n✅ CATEGORY FILTER ({category}): {before_cat} → {len(filtered_df)} records")
                print(f"   Allowed categories: {', '.join(allowed_categories)}")
                
                # DIAGNOSTIC: Verify filtering for males
                if gender_normalized == 'M':
                    ladies_found = filtered_df[filtered_df['category'].isin(self.LADIES_ONLY_CATEGORIES)]
                    if len(ladies_found) > 0:
                        print(f"   ⚠️ WARNING: {len(ladies_found)} ladies-only records found for MALE!")
                        print(f"   Ladies categories: {ladies_found['category'].unique()[:5]}")
                    else:
                        print(f"   ✓ Verified: No ladies-only categories for males")
                        print(f"   ✓ DEF/PWD/TFWS seats: ALLOWED for males")

            # === CITY FILTER ===
            if city:
                before_city = len(filtered_df)
                filtered_df = filtered_df[
                    filtered_df['city'].str.contains(city, case=False, na=False)
                ]
                print(f"✅ CITY FILTER ({city}): {before_city} → {len(filtered_df)} records")

            # === BRANCH FILTER ===
            if branch:
                before_branch = len(filtered_df)
                filtered_df = filtered_df[
                    filtered_df['branch_name'].str.contains(branch, case=False, na=False)
                ]
                print(f"✅ BRANCH FILTER ({branch}): {before_branch} → {len(filtered_df)} records")

            # === FALLBACK IF NO RESULTS ===
            if filtered_df.empty:
                print("\n⚠️ NO COLLEGES FOUND! Relaxing filters...")
                filtered_df = self.college_data.copy()
                
                # Reapply only gender filter as fallback
                if gender_normalized == 'M':
                    filtered_df = filtered_df[
                        ~filtered_df['college_name'].apply(self._is_women_only_college)
                    ]
                    filtered_df = filtered_df[
                        ~filtered_df['category'].isin(self.LADIES_ONLY_CATEGORIES)
                    ]
                    print(f"   Fallback: {len(filtered_df)} records (males only)")
                else:
                    print(f"   Fallback: {len(filtered_df)} records (all colleges)")

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

            # === DIAGNOSTIC: Check key colleges before gap filter ===
            print(f"\n🔍 KEY COLLEGES CHECK (Before Gap Filter):")
            print(f"   Your percentile: {percentile}%")
            
            coep_check = filtered_df[filtered_df['college_name'].str.contains(
                'COEP|College of Engineering.*Pune', case=False, na=False, regex=True
            )]
            if len(coep_check) > 0:
                print(f"   ✅ COEP: {len(coep_check)} records | Predicted: {coep_check['Predicted_Percentile'].min():.1f}% - {coep_check['Predicted_Percentile'].max():.1f}%")
            
            cummins_check = filtered_df[filtered_df['college_name'].str.contains(
                'Cummins', case=False, na=False
            )]
            if len(cummins_check) > 0:
                print(f"   ✅ Cummins: {len(cummins_check)} records | Predicted: {cummins_check['Predicted_Percentile'].min():.1f}% - {cummins_check['Predicted_Percentile'].max():.1f}%")

            # === APPLY WIDENED GAP FILTERING ===
            print(f"\n🎯 APPLYING WIDENED GAP FILTER:")
            print(f"   Range: {percentile - 15:.1f}% to {percentile + 10:.1f}%")
            
            realistic_df = filtered_df[
                (filtered_df['Predicted_Percentile'] >= percentile - 15) &
                (filtered_df['Predicted_Percentile'] <= percentile + 10)
            ].copy()

            print(f"✅ After gap filtering: {len(realistic_df)} colleges")

            # === FALLBACK: Even wider range if needed ===
            if realistic_df.empty:
                print("⚠️ No colleges in range! Using wider ±20% filter...")
                realistic_df = filtered_df[
                    (filtered_df['Predicted_Percentile'] >= percentile - 20) & 
                    (filtered_df['Predicted_Percentile'] <= percentile + 15)
                ].copy()
                print(f"   Relaxed filter: {len(realistic_df)} colleges")

            # === CALCULATE PROBABILITY ===
            def calculate_probability(gap):
                if gap >= 5:      return 90.0
                elif gap >= 3:    return 80.0
                elif gap >= 0:    return 70.0
                elif gap >= -2:   return 60.0
                elif gap >= -5:   return 50.0
                elif gap >= -10:  return 40.0
                else:             return 30.0

            realistic_df['admission_probability'] = realistic_df['percentile_gap'].apply(
                calculate_probability
            )

            # === CATEGORIZE ===
            def categorize(prob):
                if prob >= 70:    return "HIGH"
                elif prob >= 50:  return "MODERATE"
                else:             return "BACKUP"

            realistic_df['category_tag'] = realistic_df['admission_probability'].apply(categorize)

            # === CALCULATE CLOSENESS ===
            realistic_df['closeness'] = abs(percentile - realistic_df['Predicted_Percentile'])

            # === DEDUPLICATE BY COLLEGE ===
            realistic_df = realistic_df.sort_values(
                by=['closeness', 'closing_percentile', 'Type_Weight'],
                ascending=[True, False, False]
            )
            
            recommendations = realistic_df.groupby('college_name', as_index=False).first()

            # === FINAL SORT ===
            recommendations = recommendations.sort_values(
                by=['closeness', 'closing_percentile', 'Type_Weight'],
                ascending=[True, False, False]
            )

            print(f"\n📊 FINAL RESULTS:")
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
                    'is_women_only': self._is_women_only_college(row['college_name']),
                    'ml_model': 'XGBoost (Enhanced)'
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
                                  gender: Optional[str] = None,
                                  city: Optional[str] = None,
                                  limit: int = 100) -> List[Dict]:
        """Predict for multiple branches with all filters"""
        all_results = []
        
        for branch in branches:
            results = self.predict_colleges(
                rank=rank,
                percentile=percentile,
                category=category,
                gender=gender,
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