# D:\CET_Prediction\cet-web-app\backend\routes\college_comparison_routes.py

from flask import Blueprint, request, jsonify
from flask_caching import Cache
import time
import os
import sys

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.college_comparator import CollegeComparator

college_comparison_bp = Blueprint('college_comparison', __name__)

# Initialize cache
cache = Cache(config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 300
})

# Initialize comparator globally
print("\n" + "="*60)
print("🔧 Initializing College Comparator...")
print("="*60)

try:
    comparator = CollegeComparator(
        merged_data_path='data/merged_cutoff_2021_2025.csv',
        individual_data_dir='data/cutoff_trends',
        colleges_url_path='data/Colleges_URL.xlsx',
        main_data_path='data/flattened_CAP_data done.xlsx'
    )
    print("✅ College Comparator initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize College Comparator: {e}")
    import traceback
    traceback.print_exc()
    comparator = None

print("="*60 + "\n")

# ============================================================================
# HEALTH CHECK
# ============================================================================
@college_comparison_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'timestamp': time.time(),
        'message': 'College comparison service is running',
        'comparator_loaded': comparator is not None
    }), 200

# ============================================================================
# GET ALL COLLEGES (without branch/category filtering)
# ============================================================================
@college_comparison_bp.route('/colleges', methods=['GET'])
def get_colleges():
    """Get all colleges with optional city/type filters"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        start_time = time.time()
        
        filters = {
            'city': request.args.get('city'),
            'type': request.args.get('type')
        }
        # Remove None values
        filters = {k: v for k, v in filters.items() if v}
        
        print(f"📡 Getting colleges with filters: {filters}")
        colleges = comparator.get_all_colleges(filters)
        
        elapsed = time.time() - start_time
        print(f"✅ Returned {len(colleges)} colleges in {elapsed:.2f}s")
        
        return jsonify(colleges), 200
        
    except Exception as e:
        print(f"❌ Error in get_colleges: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# SEARCH COLLEGES
# ============================================================================
@college_comparison_bp.route('/colleges/search', methods=['GET'])
def search_colleges():
    """Search colleges by name"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
        
        filters = {
            'city': request.args.get('city'),
            'type': request.args.get('type')
        }
        filters = {k: v for k, v in filters.items() if v}
        
        print(f"🔍 Searching colleges: '{query}' with filters: {filters}")
        colleges = comparator.search_colleges(query, filters)
        
        print(f"✅ Found {len(colleges)} colleges")
        return jsonify(colleges), 200
        
    except Exception as e:
        print(f"❌ Error in search_colleges: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET COMMON BRANCHES (for selected colleges)
# ============================================================================
@college_comparison_bp.route('/colleges/branches', methods=['GET'])
def get_branches():
    """Get branches, optionally filtered to common ones for selected colleges"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        start_time = time.time()
        
        # Get college codes from query params
        college_codes_str = request.args.get('college_codes', '')
        
        if college_codes_str:
            # Get branches common to these colleges only
            college_codes = [c.strip() for c in college_codes_str.split(',') if c.strip()]
            print(f"🌿 Getting common branches for {len(college_codes)} colleges: {college_codes}")
            
            # Get branches for each college
            branches_by_college = []
            for code in college_codes:
                college_branches = comparator.get_available_branches([code])
                branches_by_college.append(set(college_branches))
                print(f"   {code}: {len(college_branches)} branches")
            
            # Find intersection (common branches)
            if branches_by_college:
                common_branches = set.intersection(*branches_by_college)
                branches = sorted(list(common_branches))
                print(f"✅ Found {len(branches)} common branches")
            else:
                branches = []
        else:
            # Get all available branches
            print(f"🌿 Getting all available branches")
            branches = comparator.get_available_branches()
            print(f"✅ Found {len(branches)} branches")
        
        elapsed = time.time() - start_time
        print(f"   Completed in {elapsed:.2f}s")
        
        return jsonify(branches), 200
        
    except Exception as e:
        print(f"❌ Error in get_branches: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET COMMON CATEGORIES (for selected colleges and branch)
# ============================================================================
@college_comparison_bp.route('/colleges/categories', methods=['GET'])
def get_categories():
    """Get categories, optionally filtered to common ones for selected colleges and branch"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        start_time = time.time()
        
        college_codes_str = request.args.get('college_codes', '')
        branch = request.args.get('branch')
        
        if college_codes_str and branch:
            # Get categories common to these colleges for this branch
            college_codes = [c.strip() for c in college_codes_str.split(',') if c.strip()]
            print(f"📋 Getting common categories for {len(college_codes)} colleges, branch: {branch}")
            
            # Get categories for each college
            categories_by_college = []
            for code in college_codes:
                college_categories = comparator.get_available_categories([code], branch)
                categories_by_college.append(set(college_categories))
                print(f"   {code}: {len(college_categories)} categories")
            
            # Find intersection (common categories)
            if categories_by_college:
                common_categories = set.intersection(*categories_by_college)
                categories = sorted(list(common_categories))
                print(f"✅ Found {len(categories)} common categories")
            else:
                categories = []
        else:
            # Get all available categories
            print(f"📋 Getting all available categories")
            categories = comparator.get_available_categories()
            print(f"✅ Found {len(categories)} categories")
        
        elapsed = time.time() - start_time
        print(f"   Completed in {elapsed:.2f}s")
        
        return jsonify(categories), 200
        
    except Exception as e:
        print(f"❌ Error in get_categories: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET CITIES
# ============================================================================
@college_comparison_bp.route('/colleges/cities', methods=['GET'])
def get_cities():
    """Get all available cities"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        start_time = time.time()
        cities = comparator.get_available_cities()
        
        elapsed = time.time() - start_time
        print(f"✅ Returned {len(cities)} cities in {elapsed:.2f}s")
        
        return jsonify(cities), 200
    except Exception as e:
        print(f"❌ Error in get_cities: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET COLLEGE TYPES
# ============================================================================
@college_comparison_bp.route('/colleges/types', methods=['GET'])
def get_types():
    """Get normalized college types"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        types = comparator.get_college_types()
        return jsonify(types), 200
    except Exception as e:
        print(f"❌ Error in get_types: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# COMPARE COLLEGES
# ============================================================================
@college_comparison_bp.route('/colleges/compare', methods=['POST'])
def compare_colleges():
    """Compare multiple colleges for specific branch and category"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        start_time = time.time()
        
        data = request.get_json()
        college_codes = data.get('college_codes', [])
        branch = data.get('branch')
        category = data.get('category')
        
        if not college_codes or not branch or not category:
            return jsonify({
                'error': 'Missing required parameters',
                'required': ['college_codes', 'branch', 'category']
            }), 400
        
        print(f"\n📊 Comparing colleges:")
        print(f"   Colleges: {college_codes}")
        print(f"   Branch: {branch}")
        print(f"   Category: {category}")
        
        comparison_data = comparator.compare_colleges(college_codes, branch, category)
        
        # Debug: Check what data we got
        total_records = 0
        for code, data_list in comparison_data.items():
            if data_list:
                years = [d['year'] for d in data_list]
                print(f"   {code}: {len(data_list)} records, years: {years}")
                total_records += len(data_list)
            else:
                print(f"   {code}: ⚠️ NO DATA FOUND")
        
        elapsed = time.time() - start_time
        print(f"✅ Comparison completed in {elapsed:.2f}s")
        print(f"   Total records: {total_records}\n")
        
        return jsonify({
            'comparison_data': comparison_data,
            'metadata': {
                'branch': branch,
                'category': category,
                'colleges_compared': len(college_codes),
                'total_records': total_records,
                'timestamp': time.time()
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error in compare_colleges: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET COLLEGE BY CODE
# ============================================================================
@college_comparison_bp.route('/colleges/<college_code>', methods=['GET'])
def get_college_by_code(college_code):
    """Get specific college by code"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        stats = comparator.get_college_stats(college_code)
        
        if not stats:
            return jsonify({'error': 'College not found'}), 404
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"❌ Error in get_college_by_code: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET COLLEGE STATS
# ============================================================================
@college_comparison_bp.route('/colleges/<college_code>/stats', methods=['GET'])
def get_college_stats(college_code):
    """Get comprehensive statistics for a college"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        stats = comparator.get_college_stats(college_code)
        
        if not stats:
            return jsonify({'error': 'College not found'}), 404
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"❌ Error in get_college_stats: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET CUTOFF TRENDS
# ============================================================================
@college_comparison_bp.route('/colleges/<college_code>/trends', methods=['GET'])
def get_cutoff_trends(college_code):
    """Get cutoff trends for specific college, branch, and category"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        branch = request.args.get('branch')
        category = request.args.get('category')
        
        if not branch or not category:
            return jsonify({
                'error': 'Missing required parameters',
                'required': ['branch', 'category']
            }), 400
        
        print(f"📈 Getting trends for {college_code}, {branch}, {category}")
        
        data = comparator.get_college_data(college_code, branch, category)
        
        if not data:
            return jsonify({
                'error': 'No data found',
                'college_code': college_code,
                'branch': branch,
                'category': category
            }), 404
        
        return jsonify(data), 200
        
    except Exception as e:
        print(f"❌ Error in get_cutoff_trends: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET TREND ANALYSIS
# ============================================================================
@college_comparison_bp.route('/colleges/<college_code>/trend-analysis', methods=['GET'])
def get_trend_analysis(college_code):
    """Get trend analysis for specific college, branch, and category"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        branch = request.args.get('branch')
        category = request.args.get('category')
        
        if not branch or not category:
            return jsonify({
                'error': 'Missing required parameters',
                'required': ['branch', 'category']
            }), 400
        
        analysis = comparator.get_trend_analysis(college_code, branch, category)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        print(f"❌ Error in get_trend_analysis: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET CATEGORY INFO
# ============================================================================
@college_comparison_bp.route('/categories/<category_code>/info', methods=['GET'])
def get_category_info(category_code):
    """Get display name and description for category code"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        display_name = comparator.get_category_display_name(category_code)
        description = comparator.get_category_description(category_code)
        
        return jsonify({
            'code': category_code,
            'display_name': display_name,
            'description': description
        }), 200
        
    except Exception as e:
        print(f"❌ Error in get_category_info: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET RECOMMENDATIONS (Future enhancement)
# ============================================================================
@college_comparison_bp.route('/colleges/recommendations', methods=['POST'])
def get_recommendations():
    """Get college recommendations based on rank and preferences"""
    try:
        if comparator is None:
            return jsonify({'error': 'Comparator not initialized'}), 500
        
        data = request.get_json()
        rank = data.get('rank')
        category = data.get('category')
        
        if not rank or not category:
            return jsonify({
                'error': 'Missing required parameters',
                'required': ['rank', 'category']
            }), 400
        
        # TODO: Implement recommendation logic
        return jsonify({
            'message': 'Recommendations feature coming soon',
            'rank': rank,
            'category': category
        }), 501  # Not Implemented
        
    except Exception as e:
        print(f"❌ Error in get_recommendations: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# INIT CACHE WITH APP
# ============================================================================
def init_cache(app):
    """Initialize cache with Flask app"""
    cache.init_app(app)
    print("✅ Cache initialized for college comparison blueprint")