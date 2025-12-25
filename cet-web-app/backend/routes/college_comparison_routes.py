# backend/routes/college_comparison_routes.py
from flask import Blueprint, request, jsonify
from services.college_comparison_service import CollegeComparisonService

college_comparison_bp = Blueprint('college_comparison', __name__)
service = CollegeComparisonService()

@college_comparison_bp.route('/colleges', methods=['GET'])
def get_all_colleges():
    """Get all colleges with optional filters"""
    try:
        filters = {
            'city': request.args.get('city'),
            'type': request.args.get('type'),
            'branch': request.args.get('branch'),
            'category': request.args.get('category'),
            'year': request.args.get('year', '2025')
        }
        
        # Remove None values
        filters = {k: v for k, v in filters.items() if v}
        
        colleges = service.get_all_colleges(filters)
        return jsonify(colleges), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/search', methods=['GET'])
def search_colleges():
    """Search colleges by name"""
    try:
        query = request.args.get('q', '')
        filters = {
            'city': request.args.get('city'),
            'type': request.args.get('type'),
            'branch': request.args.get('branch'),
            'category': request.args.get('category'),
            'year': request.args.get('year', '2025')
        }
        
        # Remove None values
        filters = {k: v for k, v in filters.items() if v}
        
        colleges = service.search_colleges(query, filters)
        return jsonify(colleges), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/<college_code>', methods=['GET'])
def get_college_by_id(college_code):
    """Get specific college details"""
    try:
        college = service.get_college_by_code(college_code)
        if college:
            return jsonify(college), 200
        return jsonify({'error': 'College not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/<college_code>/cutoffs', methods=['GET'])
def get_college_cutoffs(college_code):
    """Get cutoff data for a specific college"""
    try:
        filters = {
            'branch': request.args.get('branch'),
            'category': request.args.get('category'),
            'year': request.args.get('year')
        }
        
        # Remove None values
        filters = {k: v for k, v in filters.items() if v}
        
        cutoffs = service.get_college_cutoffs(college_code, filters)
        return jsonify(cutoffs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/compare', methods=['POST'])
def compare_colleges():
    """Compare multiple colleges"""
    try:
        data = request.get_json()
        college_codes = data.get('college_codes', [])
        branch = data.get('branch')
        category = data.get('category')
        
        if not college_codes or len(college_codes) < 2:
            return jsonify({'error': 'At least 2 colleges required for comparison'}), 400
        
        if not branch or not category:
            return jsonify({'error': 'Branch and category are required'}), 400
        
        comparison_data = service.compare_colleges(college_codes, branch, category)
        return jsonify(comparison_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/recommendations', methods=['POST'])
def get_recommendations():
    """Get college recommendations based on rank"""
    try:
        data = request.get_json()
        rank = data.get('rank')
        category = data.get('category')
        preferences = {
            'city': data.get('city'),
            'branch': data.get('branch'),
            'college_type': data.get('college_type')
        }
        
        if not rank or not category:
            return jsonify({'error': 'Rank and category are required'}), 400
        
        recommendations = service.get_recommendations(rank, category, preferences)
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/cities', methods=['GET'])
def get_cities():
    """Get all unique cities"""
    try:
        cities = service.get_unique_cities()
        return jsonify(cities), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/branches', methods=['GET'])
def get_branches():
    """Get all unique branches"""
    try:
        branches = service.get_unique_branches()
        return jsonify(branches), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/<college_code>/trends', methods=['GET'])
def get_cutoff_trends(college_code):
    """Get cutoff trends for a college"""
    try:
        branch = request.args.get('branch')
        category = request.args.get('category')
        
        if not branch or not category:
            return jsonify({'error': 'Branch and category are required'}), 400
        
        trends = service.get_cutoff_trends(college_code, branch, category)
        return jsonify(trends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@college_comparison_bp.route('/colleges/<college_code>/stats', methods=['GET'])
def get_college_stats(college_code):
    """Get statistics for a college"""
    try:
        stats = service.get_college_stats(college_code)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500