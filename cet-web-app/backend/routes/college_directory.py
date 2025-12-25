# routes/college_directory.py

from flask import Blueprint, jsonify, request, current_app
import pandas as pd
import os
from datetime import datetime
import numpy as np
import joblib
import traceback

college_directory_bp = Blueprint('college_directory', __name__)

# Cache for loaded data
_colleges_cache = None
_predictor_model = None
_main_college_data = None

def find_file(filename, search_dirs=None):
    """Helper to find files in multiple locations"""
    if search_dirs is None:
        search_dirs = [
            '.',
            'data',
            'backend',
            'backend/data',
            os.path.join(os.path.dirname(__file__), '..'),
            os.path.join(os.path.dirname(__file__), '..', 'data'),
        ]
    
    for directory in search_dirs:
        filepath = os.path.join(directory, filename)
        if os.path.exists(filepath):
            return os.path.abspath(filepath)
    
    return None

def load_predictor_model():
    """Load the same XGBoost model used in predictor"""
    global _predictor_model, _main_college_data
    
    if _predictor_model is not None and _main_college_data is not None:
        return _predictor_model, _main_college_data
    
    try:
        # Load XGBoost model
        model_path = find_file('xgb_cap_model.pkl', ['model', 'backend/model'])
        
        if model_path and os.path.exists(model_path):
            _predictor_model = joblib.load(model_path)
            print(f"✅ Loaded XGBoost model from: {model_path}")
        else:
            print(f"⚠️ XGBoost model not found. Searched in: model/, backend/model/")
            _predictor_model = None
        
        # Load main college data
        data_path = find_file('flattened_CAP_data done.xlsx')
        
        if data_path and os.path.exists(data_path):
            _main_college_data = pd.read_excel(data_path)
            print(f"✅ Loaded college data: {len(_main_college_data)} records from {data_path}")
        else:
            print(f"⚠️ Main college data not found")
            _main_college_data = None
        
        return _predictor_model, _main_college_data
        
    except Exception as e:
        print(f"❌ Error loading predictor model: {e}")
        traceback.print_exc()
        return None, None

def get_type_weight(college_type):
    """Get type weight same as predictor"""
    type_weight_mapping = {
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
    return type_weight_mapping.get(college_type, 0.60)

def predict_cutoff_for_college(college_type, historical_cutoff=None, model=None, main_data=None):
    """Predict cutoff using the same method as predictor"""
    if model is None or main_data is None:
        return float(historical_cutoff) if historical_cutoff and historical_cutoff > 0 else 0.0
    
    try:
        type_weight = get_type_weight(college_type)
        
        min_cutoff = float(main_data['closing_percentile'].min())
        max_cutoff = float(main_data['closing_percentile'].max())
        
        if historical_cutoff and historical_cutoff > 0:
            c_normalized = (float(historical_cutoff) - min_cutoff) / (max_cutoff - min_cutoff)
        else:
            c_normalized = 0.5
        
        X = pd.DataFrame({
            'C_normalized': [c_normalized],
            'Type_Weight': [type_weight]
        })
        
        predicted = float(model.predict(X)[0])
        predicted_percentile = ((predicted - 0.0) / (1.0 - 0.0)) * 100.0
        
        return round(float(predicted_percentile), 2)
        
    except Exception as e:
        print(f"Error predicting cutoff: {e}")
        return float(historical_cutoff) if historical_cutoff and historical_cutoff > 0 else 0.0

def load_college_data():
    """Load and merge college directory with cutoff data + ML predictions"""
    global _colleges_cache
    
    if _colleges_cache is not None:
        print("📦 Using cached college data")
        return _colleges_cache
    
    try:
        print("\n" + "="*60)
        print("🔄 Loading College Directory")
        print("="*60)
        
        # Load ML model (optional)
        model, main_data = load_predictor_model()
        
        # 1. Load College Directory
        directory_path = find_file('Colleges_URL.xlsx')
        
        if not directory_path:
            raise FileNotFoundError(
                "Colleges_URL.xlsx not found. Please ensure it's in data/ or backend/data/ folder"
            )
        
        df_directory = pd.read_excel(directory_path)
        print(f"✅ Loaded {len(df_directory)} colleges from: {directory_path}")
        
        # 2. Initialize colleges dictionary
        colleges_dict = {}
        
        for _, row in df_directory.iterrows():
            college_code = str(row.get('College Code', '')).strip()
            if not college_code:
                continue
            
            colleges_dict[college_code] = {
                'College Code': college_code,
                'College Name': str(row.get('College Name', '')).strip(),
                'City': str(row.get('City', '')).strip(),
                'URL': str(row.get('URL', '')).strip(),
                'type': 'Unknown',
                'branches': [],
                'cutoff_data': {},
                'historical_cutoffs': []
            }
        
        print(f"📋 Initialized {len(colleges_dict)} colleges")
        
        # 3. Add cutoff data if available
        if main_data is not None:
            print(f"📊 Merging with {len(main_data)} cutoff records...")
            
            merged_count = 0
            for _, row in main_data.iterrows():
                college_name = str(row.get('college_name', ''))
                college_code = str(row.get('college_code', '')).strip()
                
                # Extract code from name if needed
                if not college_code and college_name:
                    parts = college_name.split('-')
                    if len(parts) > 0 and parts[0].strip().isdigit():
                        college_code = parts[0].strip()
                
                if not college_code or college_code not in colleges_dict:
                    continue
                
                merged_count += 1
                
                branch = str(row.get('branch_name', 'Computer Engineering')).strip()
                category = str(row.get('category', 'GOPENS')).strip().upper()
                cutoff = float(row.get('closing_percentile', 0))
                cutoff_rank = int(row.get('closing_rank', 0)) if pd.notna(row.get('closing_rank')) else None
                college_type = str(row.get('type', 'Unknown')).strip()
                
                if college_type != 'Unknown':
                    colleges_dict[college_code]['type'] = college_type
                
                if branch and branch not in colleges_dict[college_code]['branches']:
                    colleges_dict[college_code]['branches'].append(branch)
                
                key = f"{category}_{branch}"
                if key not in colleges_dict[college_code]['cutoff_data']:
                    colleges_dict[college_code]['cutoff_data'][key] = []
                
                colleges_dict[college_code]['cutoff_data'][key].append({
                    'percentile': float(cutoff),
                    'rank': int(cutoff_rank) if cutoff_rank else None,
                    'category': category,
                    'branch': branch
                })
                
                if cutoff > 0:
                    colleges_dict[college_code]['historical_cutoffs'].append(cutoff)
            
            print(f"✅ Merged cutoff data for {merged_count} records")
        else:
            print("⚠️ No cutoff data available - skipping merge")
        
        # 4. Calculate cutoffs
        print("\n🤖 Calculating cutoffs...")
        colleges_with_data = 0
        colleges_with_predictions = 0
        
        for college_code, college_data in colleges_dict.items():
            # Historical average - convert to native Python float
            if college_data['historical_cutoffs']:
                avg_historical = round(float(np.mean(college_data['historical_cutoffs'])), 2)
                min_historical = round(float(min(college_data['historical_cutoffs'])), 2)
                max_historical = round(float(max(college_data['historical_cutoffs'])), 2)
                has_cutoff = True
                colleges_with_data += 1
            else:
                avg_historical = 0.0
                min_historical = 0.0
                max_historical = 0.0
                has_cutoff = False
            
            # ML Prediction - ensure it returns native Python float
            predicted_cutoff = float(predict_cutoff_for_college(
                college_data['type'],
                avg_historical,
                model,
                main_data
            ))
            
            if predicted_cutoff > 0:
                colleges_with_predictions += 1
            
            # Store results - all as native Python types
            college_data['historical_cutoff'] = float(avg_historical)
            college_data['min_cutoff'] = float(min_historical)
            college_data['max_cutoff'] = float(max_historical)
            college_data['predicted_cutoff'] = float(predicted_cutoff)
            college_data['has_cutoff'] = bool(has_cutoff)
            college_data['branch_count'] = int(len(college_data['branches']))
            college_data['display_cutoff'] = float(predicted_cutoff if predicted_cutoff > 0 else avg_historical)
        
        # Convert to list and cache
        _colleges_cache = list(colleges_dict.values())
        
        print(f"\n✅ Successfully processed {len(_colleges_cache)} colleges")
        print(f"   📈 With historical data: {colleges_with_data}")
        print(f"   🤖 With ML predictions: {colleges_with_predictions}")
        print("="*60 + "\n")
        
        return _colleges_cache
        
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR loading college data:")
        print(f"   Error type: {type(e).__name__}")
        print(f"   Error message: {str(e)}")
        print(f"   Current directory: {os.getcwd()}")
        print("\nFull traceback:")
        traceback.print_exc()
        print("="*60 + "\n")
        raise

@college_directory_bp.route('/colleges/directory', methods=['GET'])
def get_college_directory():
    """Get college directory with ML-predicted cutoffs"""
    try:
        colleges = load_college_data()
        
        cities = sorted(set([c['City'] for c in colleges if c['City']]))
        all_branches = set()
        for c in colleges:
            all_branches.update(c['branches'])
        
        return jsonify({
            'success': True,
            'colleges': colleges,
            'total': len(colleges),
            'cities': cities,
            'branches': sorted(list(all_branches)),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ API Error: {error_msg}")
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': error_msg,
            'error_type': type(e).__name__,
            'current_dir': os.getcwd(),
            'hint': 'Check if Colleges_URL.xlsx exists in data/ or backend/data/ folder'
        }), 500

@college_directory_bp.route('/colleges/filter', methods=['GET'])
def filter_colleges():
    """Filter colleges"""
    try:
        city = request.args.get('city', 'ALL')
        search = request.args.get('search', '').lower()
        has_cutoff = request.args.get('has_cutoff', 'all')
        
        colleges = load_college_data()
        
        filtered = []
        for college in colleges:
            if city != 'ALL' and college['City'] != city:
                continue
            
            if search:
                college_name = college['College Name'].lower()
                college_code = str(college['College Code']).lower()
                if search not in college_name and search not in college_code:
                    continue
            
            if has_cutoff == 'yes' and not college['has_cutoff']:
                continue
            elif has_cutoff == 'no' and college['has_cutoff']:
                continue
            
            filtered.append(college)
        
        filtered.sort(key=lambda x: x['display_cutoff'], reverse=True)
        
        return jsonify({
            'success': True,
            'colleges': filtered,
            'total': len(filtered)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@college_directory_bp.route('/colleges/stats', methods=['GET'])
def get_college_stats():
    """Get statistics"""
    try:
        colleges = load_college_data()
        
        cities = set([c['City'] for c in colleges if c['City']])
        has_website = sum(1 for c in colleges if c['URL'] and c['URL'].strip())
        has_cutoff_data = sum(1 for c in colleges if c['has_cutoff'])
        has_predictions = sum(1 for c in colleges if c['predicted_cutoff'] > 0)
        
        all_branches = set()
        for c in colleges:
            all_branches.update(c['branches'])
        
        all_cutoffs = [c['display_cutoff'] for c in colleges if c['display_cutoff'] > 0]
        avg_cutoff = round(float(np.mean(all_cutoffs)), 2) if all_cutoffs else 0.0
        
        return jsonify({
            'success': True,
            'statistics': {
                'total_colleges': int(len(colleges)),
                'total_cities': int(len(cities)),
                'total_branches': int(len(all_branches)),
                'colleges_with_website': int(has_website),
                'colleges_with_cutoff': int(has_cutoff_data),
                'colleges_with_predictions': int(has_predictions),
                'website_coverage': f'{(has_website / len(colleges) * 100):.1f}%' if colleges else '0%',
                'cutoff_coverage': f'{(has_cutoff_data / len(colleges) * 100):.1f}%' if colleges else '0%',
                'avg_cutoff': float(avg_cutoff)
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@college_directory_bp.route('/colleges/<college_code>/add-to-form', methods=['POST'])
def add_to_option_form(college_code):
    """Add college to option form"""
    try:
        data = request.get_json()
        category = data.get('category', 'GOPENS').upper()
        branch = data.get('branch', 'Computer Engineering')
        
        colleges = load_college_data()
        college = next((c for c in colleges if c['College Code'] == college_code), None)
        
        if not college:
            return jsonify({
                'success': False,
                'error': 'College not found'
            }), 404
        
        # Get cutoff for specific category/branch
        key = f"{category}_{branch}"
        historical_cutoff = 0.0
        cutoff_rank = None
        
        if key in college['cutoff_data'] and college['cutoff_data'][key]:
            cutoffs = college['cutoff_data'][key]
            percentiles = [c['percentile'] for c in cutoffs if c['percentile'] > 0]
            if percentiles:
                historical_cutoff = round(float(np.mean(percentiles)), 2)
                ranks = [c['rank'] for c in cutoffs if c['rank']]
                if ranks:
                    cutoff_rank = int(np.mean(ranks))
        
        predicted_cutoff = float(college['predicted_cutoff'])
        final_cutoff = float(predicted_cutoff if predicted_cutoff > 0 else historical_cutoff)
        
        option_form_college = {
            'college_name': college['College Name'],
            'college_code': college_code,
            'city': college['City'],
            'type': college['type'],
            'branch': branch,
            'branch_code': f"{college_code}_{branch.replace(' ', '_')}_{int(datetime.now().timestamp())}",
            'historical_cutoff': float(final_cutoff),
            'predicted_cutoff': float(predicted_cutoff),
            'cutoff_rank': int(cutoff_rank) if cutoff_rank else None,
            'quota_category': category,
            'search_category': category,
            'admission_probability': 50.0,
            'percentile_gap': 0.0,
            'closeness': 0.0,
            'category': 'MODERATE',
            'college_url': college['URL'],
            'added_from_directory': True,
            'has_cutoff_data': bool(college['has_cutoff']),
            'has_ml_prediction': bool(predicted_cutoff > 0),
            'added_at': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': f'Added {college["College Name"]}',
            'college': option_form_college
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@college_directory_bp.route('/colleges/refresh', methods=['POST'])
def refresh_cache():
    """Clear cache and reload"""
    global _colleges_cache, _predictor_model, _main_college_data
    
    _colleges_cache = None
    _predictor_model = None
    _main_college_data = None
    
    try:
        load_college_data()
        return jsonify({
            'success': True,
            'message': 'Cache refreshed successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500