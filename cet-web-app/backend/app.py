# D:\CET_Prediction\cet-web-app\backend\app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.predict_route import predict_bp
from routes.college_directory import college_directory_bp
from routes.college_comparison_routes import college_comparison_bp
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load comparison data globally for branches/categories endpoints
comparison_df = None
try:
    comparison_csv_path = 'data/merged_cutoff_2021_2025.csv'
    if os.path.exists(comparison_csv_path):
        comparison_df = pd.read_csv(comparison_csv_path)
        print(f"✅ Loaded comparison data: {len(comparison_df)} records")
    else:
        print(f"⚠️  Comparison data not found at: {comparison_csv_path}")
except Exception as e:
    print(f"❌ Error loading comparison data: {str(e)}")

# Register blueprints
app.register_blueprint(predict_bp)
app.register_blueprint(college_directory_bp, url_prefix='/api')
app.register_blueprint(college_comparison_bp, url_prefix='/api')

@app.route('/', methods=['GET'])
def home():
    endpoints = {
        'health': 'GET /api/health',
        'model_info': 'GET /api/model-info',
        'predict': 'POST /api/predict',
        'colleges_dataset': 'GET /api/colleges/dataset',
        'college_directory': 'GET /api/colleges/directory',
        'filter_colleges': 'GET /api/colleges/filter',
        'college_details': 'GET /api/colleges/<code>/details',
        'college_stats': 'GET /api/colleges/stats',
        'predict_cutoff': 'POST /api/colleges/<code>/predict',
        'colleges_list': 'GET /api/colleges',
        'search_colleges': 'GET /api/colleges/search',
        'compare_colleges': 'POST /api/colleges/compare',
        'get_cities': 'GET /api/colleges/cities',
        'get_branches': 'GET /api/colleges/branches',
        'get_categories': 'GET /api/colleges/categories',
        'get_recommendations': 'POST /api/colleges/recommendations'
    }
    
    return jsonify({
        'message': '🎓 CET Predictor API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': endpoints
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'Backend server is operational'
    })

@app.route('/api/test-blueprint', methods=['GET'])
def test_blueprint():
    return jsonify({
        'success': True,
        'message': 'Blueprint is working',
        'endpoints': [
            '/api/colleges/directory',
            '/api/colleges/filter',
            '/api/colleges/stats'
        ]
    })

@app.route('/api/colleges/dataset', methods=['GET'])
def get_college_dataset():
    try:
        file_path = 'backend/data/flattened_CAP_data done.xlsx'
        
        print(f"📂 Looking for file at: {file_path}")
        print(f"📁 Current working directory: {os.getcwd()}")
        print(f"🔍 File exists: {os.path.exists(file_path)}")
        
        if not os.path.exists(file_path):
            absolute_path = 'D:/CET_Prediction/cet-web-app/backend/data/flattened_CAP_data done.xlsx'
            if os.path.exists(absolute_path):
                file_path = absolute_path
                print(f"✅ Found file at absolute path: {file_path}")
            else:
                return jsonify({
                    'success': False,
                    'error': f'Excel file not found at: {file_path}',
                    'current_directory': os.getcwd(),
                    'files_in_data_dir': os.listdir('backend/data') if os.path.exists('backend/data') else 'Directory not found'
                }), 404
        
        print("📊 Reading Excel file...")
        df = pd.read_excel(file_path)
        
        df = df.where(pd.notna(df), None)
        
        data = df.to_dict('records')
        
        print(f"✅ Successfully loaded {len(data)} records")
        
        return jsonify({
            'success': True,
            'data': data,
            'count': len(data),
            'columns': list(df.columns),
            'sample_size': min(5, len(data))
        })
        
    except Exception as e:
        print(f"❌ Error loading dataset: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/colleges/directory/stats', methods=['GET'])
def directory_stats():
    """Quick endpoint to check college directory status"""
    try:
        dir_path = 'backend/data/Colleges_URL.xlsx'
        
        if not os.path.exists(dir_path):
            dir_path = 'D:/CET_Prediction/cet-web-app/backend/data/Colleges_URL.xlsx'
            
            if not os.path.exists(dir_path):
                return jsonify({
                    'success': False,
                    'message': 'College directory file not found',
                    'expected_paths': [
                        'backend/data/Colleges_URL.xlsx',
                        'D:/CET_Prediction/cet-web-app/backend/data/Colleges_URL.xlsx'
                    ],
                    'files_in_data_dir': os.listdir('backend/data') if os.path.exists('backend/data') else []
                }), 404
        
        df = pd.read_excel(dir_path, nrows=5)
        
        return jsonify({
            'success': True,
            'message': 'College directory file is accessible',
            'file_path': dir_path,
            'columns': list(df.columns),
            'sample_count': len(df),
            'sample_data': df.head(3).to_dict('records')
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'file_path': dir_path if 'dir_path' in locals() else 'Unknown'
        }), 500

# ============================================================
# NEW ENDPOINTS FOR BRANCHES AND CATEGORIES
# ============================================================

@app.route('/api/colleges/branches', methods=['GET'])
def get_branches():
    """
    Get all unique branches from the comparison database
    Returns a sorted list of branch names
    """
    try:
        if comparison_df is None:
            return jsonify({
                'error': 'Comparison data not loaded',
                'message': 'The comparison dataset is not available'
            }), 500
        
        # Get unique branches (adjust column name if different)
        if 'Branch' in comparison_df.columns:
            branches = comparison_df['Branch'].dropna().unique().tolist()
        elif 'branch' in comparison_df.columns:
            branches = comparison_df['branch'].dropna().unique().tolist()
        else:
            return jsonify({
                'error': 'Branch column not found',
                'available_columns': list(comparison_df.columns)
            }), 500
        
        branches_sorted = sorted(branches)
        
        print(f"✅ Returning {len(branches_sorted)} branches")
        return jsonify(branches_sorted), 200
    
    except Exception as e:
        print(f"❌ Error fetching branches: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to fetch branches',
            'message': str(e)
        }), 500


@app.route('/api/colleges/categories', methods=['GET'])
def get_categories():
    """
    Get all unique categories from the comparison database
    Returns a sorted list of category codes
    """
    try:
        if comparison_df is None:
            return jsonify({
                'error': 'Comparison data not loaded',
                'message': 'The comparison dataset is not available'
            }), 500
        
        # Get unique categories (adjust column name if different)
        if 'Category' in comparison_df.columns:
            categories = comparison_df['Category'].dropna().unique().tolist()
        elif 'category' in comparison_df.columns:
            categories = comparison_df['category'].dropna().unique().tolist()
        else:
            return jsonify({
                'error': 'Category column not found',
                'available_columns': list(comparison_df.columns)
            }), 500
        
        categories_sorted = sorted(categories)
        
        print(f"✅ Returning {len(categories_sorted)} categories")
        return jsonify(categories_sorted), 200
    
    except Exception as e:
        print(f"❌ Error fetching categories: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to fetch categories',
            'message': str(e)
        }), 500


@app.route('/api/colleges/options', methods=['POST'])
def get_college_options():
    """
    Get available branches and categories for selected colleges
    Request body: { "college_codes": ["1234", "5678"] }
    """
    try:
        if comparison_df is None:
            return jsonify({
                'error': 'Comparison data not loaded'
            }), 500
        
        data = request.get_json()
        college_codes = data.get('college_codes', [])
        
        if not college_codes:
            return jsonify({
                'error': 'No college codes provided'
            }), 400
        
        # Determine the college code column name
        college_code_col = None
        for col in ['College_Code', 'college_code', 'CollegeCode']:
            if col in comparison_df.columns:
                college_code_col = col
                break
        
        if not college_code_col:
            return jsonify({
                'error': 'College code column not found',
                'available_columns': list(comparison_df.columns)
            }), 500
        
        # Filter dataframe for selected colleges
        filtered_df = comparison_df[comparison_df[college_code_col].isin(college_codes)]
        
        # Get unique branches and categories for these colleges
        branch_col = 'Branch' if 'Branch' in filtered_df.columns else 'branch'
        category_col = 'Category' if 'Category' in filtered_df.columns else 'category'
        
        branches = filtered_df[branch_col].dropna().unique().tolist()
        categories = filtered_df[category_col].dropna().unique().tolist()
        
        return jsonify({
            'branches': sorted(branches),
            'categories': sorted(categories),
            'college_count': len(college_codes),
            'records_found': len(filtered_df)
        }), 200
    
    except Exception as e:
        print(f"❌ Error fetching college options: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to fetch options',
            'message': str(e)
        }), 500

# ============================================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 CET College Predictor - Backend Server")
    print("="*50)
    print("📍 Server: http://localhost:5000")
    print("📊 API Docs: http://localhost:5000/")
    print("🎓 Dataset Endpoint: GET /api/colleges/dataset")
    print("📚 College Directory: GET /api/colleges/directory")
    print("🔍 Check directory: GET /api/colleges/directory/stats")
    print("🔄 Comparison Endpoint: GET /api/colleges")
    print("🔍 Search Colleges: GET /api/colleges/search")
    print("🌿 Get Branches: GET /api/colleges/branches")
    print("📋 Get Categories: GET /api/colleges/categories")
    print("="*50 + "\n")
    
    # Test if college directory file exists
    dir_path = 'backend/data/Colleges_URL.xlsx'
    abs_path = 'D:/CET_Prediction/cet-web-app/backend/data/Colleges_URL.xlsx'
    
    if os.path.exists(dir_path):
        print(f"✅ College directory file found: {dir_path}")
    elif os.path.exists(abs_path):
        print(f"✅ College directory file found (absolute): {abs_path}")
    else:
        print(f"⚠️  College directory file not found. Expected at:")
        print(f"   - {dir_path}")
        print(f"   - {abs_path}")
        print("   Make sure Colleges_URL.xlsx is in the backend/data/ folder")
    
    # Check comparison data file
    comparison_csv = 'data/merged_cutoff_2021_2025.csv'
    if os.path.exists(comparison_csv):
        print(f"✅ Comparison data file found: {comparison_csv}")
        # Load and show stats
        try:
            test_df = pd.read_csv(comparison_csv)
            print(f"   📊 Records: {len(test_df)}")
            if 'Branch' in test_df.columns or 'branch' in test_df.columns:
                branch_col = 'Branch' if 'Branch' in test_df.columns else 'branch'
                print(f"   🌿 Branches: {test_df[branch_col].nunique()}")
            if 'Category' in test_df.columns or 'category' in test_df.columns:
                cat_col = 'Category' if 'Category' in test_df.columns else 'category'
                print(f"   📋 Categories: {test_df[cat_col].nunique()}")
        except Exception as e:
            print(f"   ⚠️  Error reading comparison data: {str(e)}")
    else:
        print(f"⚠️  Comparison data file not found at: {comparison_csv}")
        print("   Make sure merged_cutoff_2021_2025.csv is in the data/ folder")
    
    print("\n" + "="*50)
    print("✅ Server starting...")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')