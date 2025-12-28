# D:\CET_Prediction\cet-web-app\backend\app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from routes.predict_route import predict_bp
from routes.college_directory import college_directory_bp
from routes.college_comparison_routes import college_comparison_bp
from routes.chatbot_route import chatbot_bp
from routes.resource_vault_route import resource_vault_bp  # ✅ NEW: Resource Vault import
import pandas as pd
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# ============================================================
# JWT Configuration
# ============================================================
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY", "dev-secret-key-change-this"
)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
jwt = JWTManager(app)
# ============================================================

print("\n" + "="*60)
print("🚀 Initializing CET Predictor Backend...")
print("="*60)

# Load comparison data globally for backwards compatibility
comparison_df = None
try:
    comparison_csv_path = 'data/merged_cutoff_2021_2025.csv'
    if os.path.exists(comparison_csv_path):
        print(f"📂 Loading comparison data...")
        comparison_df = pd.read_csv(comparison_csv_path)
        comparison_df['year'] = comparison_df['year'].astype(str)
        print(f"✅ Loaded comparison data: {len(comparison_df):,} records")
    else:
        print(f"⚠️  Comparison data not found at: {comparison_csv_path}")
except Exception as e:
    print(f"❌ Error loading comparison data: {str(e)}")

print("="*60 + "\n")

# Register blueprints
print("📋 Registering blueprints...")
app.register_blueprint(predict_bp)
app.register_blueprint(college_directory_bp, url_prefix='/api')
app.register_blueprint(college_comparison_bp, url_prefix='/api')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
app.register_blueprint(resource_vault_bp)  # ✅ NEW: Register Resource Vault blueprint
print("✅ All blueprints registered (including chatbot & resource vault)")

@app.route('/', methods=['GET'])
def home():
    endpoints = {
        'health': 'GET /api/health',
        'model_info': 'GET /api/model-info',
        'predict': 'POST /api/predict',
        
        # Dataset endpoints
        'colleges_dataset': 'GET /api/colleges/dataset',
        'college_directory': 'GET /api/colleges/directory',
        'filter_colleges': 'GET /api/colleges/filter',
        'college_details': 'GET /api/colleges/<code>/details',
        'college_stats': 'GET /api/colleges/stats',
        'predict_cutoff': 'POST /api/colleges/<code>/predict',
        
        # Enhanced comparison endpoints
        'colleges_list': 'GET /api/colleges',
        'search_colleges': 'GET /api/colleges/search',
        'compare_colleges': 'POST /api/colleges/compare',
        'get_cities': 'GET /api/colleges/cities',
        'get_branches': 'GET /api/colleges/branches',
        'get_categories': 'GET /api/colleges/categories',
        'get_college_types': 'GET /api/colleges/types',
        'get_recommendations': 'POST /api/colleges/recommendations',
        'get_college_by_code': 'GET /api/colleges/<code>',
        'get_college_cutoffs': 'GET /api/colleges/<code>/cutoffs',
        'get_cutoff_trends': 'GET /api/colleges/<code>/trends',
        'get_college_stats': 'GET /api/colleges/<code>/stats',
        'get_trend_analysis': 'GET /api/colleges/<code>/trend-analysis',
        'get_category_info': 'GET /api/categories/<code>/info',
        
        # Chatbot endpoints
        'chatbot_health': 'GET /api/chatbot/health',
        'chatbot_greeting': 'GET /api/chatbot/greeting',
        'chatbot_quick_replies': 'GET /api/chatbot/quick-replies',
        'chatbot_chat': 'POST /api/chatbot/chat',
        'chatbot_clear': 'POST /api/chatbot/clear',
        
        # ✅ NEW: Resource Vault endpoints
        'resources_health': 'GET /api/resources/health',
        'resources_summary': 'GET /api/resources/summary',
        'resources_documents': 'GET /api/resources/documents',
        'resources_scholarships': 'GET /api/resources/scholarships',
        'resources_links': 'GET /api/resources/links',
        'resources_contacts': 'GET /api/resources/contacts',
        'resources_dates': 'GET /api/resources/dates',
        'resources_tips': 'GET /api/resources/tips'
    }
    
    return jsonify({
        'message': '🎓 CET Predictor API with AI Chatbot & Resource Vault',
        'status': 'running',
        'version': '2.2.0 (Enhanced with Resource Vault)',
        'endpoints': endpoints
    })

@app.route('/api/health', methods=['GET'])
def health():
    # Check chatbot service health
    chatbot_status = 'unknown'
    try:
        gemini_key = os.getenv('GEMINI_API_KEY')
        chatbot_status = 'configured' if gemini_key else 'not_configured'
    except:
        chatbot_status = 'error'
    
    return jsonify({
        'status': 'healthy',
        'message': 'Backend server is operational',
        'version': '2.2.0',
        'services': {
            'prediction': 'operational',
            'college_directory': 'operational',
            'college_comparison': 'operational',
            'chatbot': chatbot_status,
            'resource_vault': 'operational'  # ✅ NEW
        }
    })

@app.route('/api/test-blueprint', methods=['GET'])
def test_blueprint():
    return jsonify({
        'success': True,
        'message': 'Blueprint is working',
        'endpoints': [
            '/api/colleges/directory',
            '/api/colleges/filter',
            '/api/colleges/stats',
            '/api/chatbot/health',
            '/api/chatbot/chat',
            '/api/resources/documents',  # ✅ NEW
            '/api/resources/scholarships',  # ✅ NEW
            '/api/resources/summary'  # ✅ NEW
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
# LEGACY ENDPOINTS (For backwards compatibility)
# ============================================================

@app.route('/api/colleges/branches/legacy', methods=['GET'])
def get_branches_legacy():
    """LEGACY: Get all unique branches from comparison_df"""
    try:
        if comparison_df is None:
            return jsonify({
                'error': 'Comparison data not loaded',
                'message': 'The comparison dataset is not available'
            }), 500
        
        if 'branch_name' in comparison_df.columns:
            branches = comparison_df['branch_name'].dropna().unique().tolist()
        elif 'Branch' in comparison_df.columns:
            branches = comparison_df['Branch'].dropna().unique().tolist()
        elif 'branch' in comparison_df.columns:
            branches = comparison_df['branch'].dropna().unique().tolist()
        else:
            return jsonify({
                'error': 'Branch column not found',
                'available_columns': list(comparison_df.columns)
            }), 500
        
        branches_sorted = sorted(branches)
        
        print(f"✅ [LEGACY] Returning {len(branches_sorted)} branches")
        return jsonify(branches_sorted), 200
    
    except Exception as e:
        print(f"❌ Error fetching branches: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to fetch branches',
            'message': str(e)
        }), 500


@app.route('/api/colleges/categories/legacy', methods=['GET'])
def get_categories_legacy():
    """LEGACY: Get all unique categories from comparison_df"""
    try:
        if comparison_df is None:
            return jsonify({
                'error': 'Comparison data not loaded',
                'message': 'The comparison dataset is not available'
            }), 500
        
        if 'category' in comparison_df.columns:
            categories = comparison_df['category'].dropna().unique().tolist()
        elif 'Category' in comparison_df.columns:
            categories = comparison_df['Category'].dropna().unique().tolist()
        else:
            return jsonify({
                'error': 'Category column not found',
                'available_columns': list(comparison_df.columns)
            }), 500
        
        categories_sorted = sorted(categories)
        
        print(f"✅ [LEGACY] Returning {len(categories_sorted)} categories")
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
    """LEGACY: Get available branches and categories for selected colleges"""
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
        
        college_code_col = None
        for col in ['college_code', 'College_Code', 'CollegeCode']:
            if col in comparison_df.columns:
                college_code_col = col
                break
        
        if not college_code_col:
            return jsonify({
                'error': 'College code column not found',
                'available_columns': list(comparison_df.columns)
            }), 500
        
        try:
            college_codes = [int(code) for code in college_codes]
        except:
            pass
        
        filtered_df = comparison_df[comparison_df[college_code_col].isin(college_codes)]
        
        branch_col = None
        for col in ['branch_name', 'Branch', 'branch']:
            if col in filtered_df.columns:
                branch_col = col
                break
        
        category_col = None
        for col in ['category', 'Category']:
            if col in filtered_df.columns:
                category_col = col
                break
        
        if not branch_col or not category_col:
            return jsonify({
                'error': 'Required columns not found',
                'available_columns': list(filtered_df.columns)
            }), 500
        
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
    print("\n" + "="*60)
    print("🚀 CET College Predictor - Enhanced Backend Server v2.2")
    print("   with AI-Powered Chatbot 🤖 & Resource Vault 📚")
    print("="*60)
    print("📍 Server: http://localhost:5000")
    print("📊 API Docs: http://localhost:5000/")
    print("="*60)
    
    print("\n📚 Available Endpoints:")
    print("  🎓 Dataset: GET /api/colleges/dataset")
    print("  📖 Directory: GET /api/colleges/directory")
    print("  🔍 Search: GET /api/colleges/search")
    print("  🔄 Compare: POST /api/colleges/compare")
    print("  🌿 Branches: GET /api/colleges/branches")
    print("  📋 Categories: GET /api/colleges/categories")
    print("  🏢 Types: GET /api/colleges/types")
    print("  📈 Trends: GET /api/colleges/<code>/trends")
    print("  📊 Stats: GET /api/colleges/<code>/stats")
    print("\n  🤖 Chatbot Endpoints:")
    print("  ✅ Health: GET /api/chatbot/health")
    print("  👋 Greeting: GET /api/chatbot/greeting")
    print("  ⚡ Quick Replies: GET /api/chatbot/quick-replies")
    print("  💬 Chat: POST /api/chatbot/chat")
    print("  🔄 Clear: POST /api/chatbot/clear")
    print("\n  📚 Resource Vault Endpoints:")
    print("  ✅ Health: GET /api/resources/health")
    print("  📊 Summary: GET /api/resources/summary")
    print("  📄 Documents: GET /api/resources/documents")
    print("  💰 Scholarships: GET /api/resources/scholarships")
    print("  🔗 Links: GET /api/resources/links")
    print("  📞 Contacts: GET /api/resources/contacts")
    print("  📅 Dates: GET /api/resources/dates")
    print("  💡 Tips: GET /api/resources/tips")
    print("="*60)
    
    # Check Gemini API configuration
    print("\n🤖 Chatbot Configuration:")
    gemini_key = os.getenv('GEMINI_API_KEY')
    if gemini_key:
        print(f"  ✅ Gemini API Key: Configured (starts with {gemini_key[:10]}...)")
    else:
        print("  ⚠️  Gemini API Key: Not configured")
        print("     Add GEMINI_API_KEY to backend/.env file")
    
    # Check JWT configuration
    print("\n🔐 JWT Configuration:")
    jwt_key = os.getenv('JWT_SECRET_KEY')
    if jwt_key:
        print(f"  ✅ JWT Secret Key: Configured")
    else:
        print("  ⚠️  JWT Secret Key: Using default (change in production)")
    
    # Check Resource Vault service
    print("\n📚 Resource Vault Configuration:")
    try:
        from services.resource_service import resource_service
        summary = resource_service.get_dashboard_summary()
        print(f"  ✅ Resource Service: Loaded")
        print(f"     📄 Documents: {summary['total_documents']}")
        print(f"     💰 Scholarships: {summary['total_scholarships']}")
        print(f"     📅 Upcoming Dates: {summary['upcoming_dates']}")
        print(f"     💡 Tips: {summary['total_tips']}")
    except Exception as e:
        print(f"  ⚠️  Resource Service: Error loading - {str(e)}")
    
    # Test data files
    dir_path = 'backend/data/Colleges_URL.xlsx'
    abs_path = 'D:/CET_Prediction/cet-web-app/backend/data/Colleges_URL.xlsx'
    
    print("\n🔍 Data Files Status:")
    if os.path.exists(dir_path):
        print(f"  ✅ College directory: {dir_path}")
    elif os.path.exists(abs_path):
        print(f"  ✅ College directory: {abs_path}")
    else:
        print(f"  ⚠️  College directory not found")
    
    comparison_csv = 'data/merged_cutoff_2021_2025.csv'
    if os.path.exists(comparison_csv):
        print(f"  ✅ Comparison data: {comparison_csv}")
        try:
            test_df = pd.read_csv(comparison_csv)
            print(f"     📊 Records: {len(test_df):,}")
            
            branch_col = None
            for col in ['branch_name', 'Branch', 'branch']:
                if col in test_df.columns:
                    branch_col = col
                    break
            if branch_col:
                print(f"     🌿 Branches: {test_df[branch_col].nunique()}")
            
            cat_col = None
            for col in ['category', 'Category']:
                if col in test_df.columns:
                    cat_col = col
                    break
            if cat_col:
                print(f"     📋 Categories: {test_df[cat_col].nunique()}")
            
            if 'year' in test_df.columns:
                years = sorted(test_df['year'].unique())
                print(f"     📅 Years: {', '.join(map(str, years))}")
                
        except Exception as e:
            print(f"     ⚠️  Error reading: {str(e)}")
    else:
        print(f"  ⚠️  Comparison data not found")
    
    print("\n" + "="*60)
    print("✅ Server starting...")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')