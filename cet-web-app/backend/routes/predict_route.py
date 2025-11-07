from flask import Blueprint, request, jsonify
from services.predictor import CollegePredictor
import traceback

predict_bp = Blueprint('predict', __name__)

# Initialize predictor once when app starts
try:
    predictor = CollegePredictor()
    print("✅ Predictor initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize predictor: {e}")
    traceback.print_exc()
    predictor = None

@predict_bp.route('/api/model-info', methods=['GET'])
def model_info():
    """Get information about loaded model and data"""
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500
    
    try:
        info = predictor.get_college_info()
        return jsonify({
            'success': True,
            'data': info
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@predict_bp.route('/api/filters', methods=['GET'])
def get_filters():
    """Get available filter options (branches, cities)"""
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500
    
    try:
        return jsonify({
            'success': True,
            'branches': predictor.available_branches,
            'cities': predictor.available_cities
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@predict_bp.route('/api/predict', methods=['POST'])
def predict_colleges():
    """
    Main college prediction endpoint
    
    Expected JSON:
    {
        "rank": 191,
        "percentile": 99.98,
        "category": "OPEN",
        "city": "Pune",  // optional
        "branches": ["Computer", "IT"]  // optional, if empty returns all
    }
    
    Returns:
    {
        "success": true,
        "input": {...},
        "statistics": {...},
        "predictions": [...]
    }
    """
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500
    
    try:
        data = request.json
        
        # Validate input
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Extract and validate parameters
        rank = data.get('rank')
        percentile = data.get('percentile')
        category = data.get('category', 'OPEN').upper()
        city = data.get('city')
        branches = data.get('branches', [])
        
        # Validation
        if not rank or not percentile:
            return jsonify({
                'success': False,
                'error': 'Rank and percentile are required'
            }), 400
        
        if not isinstance(rank, (int, float)) or rank <= 0:
            return jsonify({
                'success': False,
                'error': 'Invalid rank value'
            }), 400
        
        if not isinstance(percentile, (int, float)) or percentile < 0 or percentile > 100:
            return jsonify({
                'success': False,
                'error': 'Percentile must be between 0 and 100'
            }), 400
        
        # Run prediction
        if branches and len(branches) > 0:
            # Multiple branches
            predictions = predictor.predict_multiple_branches(
                rank=int(rank),
                percentile=float(percentile),
                category=category,
                branches=branches,
                city=city,
                limit=50
            )
        else:
            # Single prediction (all branches)
            predictions = predictor.predict_colleges(
                rank=int(rank),
                percentile=float(percentile),
                category=category,
                city=city,
                limit=50
            )
        
        # Get statistics
        stats = predictor.get_statistics(predictions)
        
        return jsonify({
            'success': True,
            'input': {
                'rank': rank,
                'percentile': percentile,
                'category': category,
                'city': city,
                'branches': branches if branches else ['All']
            },
            'statistics': stats,
            'total_results': len(predictions),
            'predictions': predictions
        })
        
    except Exception as e:
        print(f"❌ API Error: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'type': type(e).__name__
        }), 500

@predict_bp.route('/api/suggest-branches', methods=['POST'])
def suggest_branches():
    """
    Suggest alternative branches with better admission chances
    
    Expected JSON:
    {
        "rank": 191,
        "percentile": 99.98,
        "category": "OPEN",
        "preferred_branch": "Computer",
        "city": "Pune"  // optional
    }
    """
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500
    
    try:
        data = request.json
        
        rank = data.get('rank')
        percentile = data.get('percentile')
        category = data.get('category', 'OPEN')
        preferred_branch = data.get('preferred_branch')
        city = data.get('city')
        
        if not all([rank, percentile, preferred_branch]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        suggestions = predictor.get_branch_suggestions(
            rank=int(rank),
            percentile=float(percentile),
            category=category,
            preferred_branch=preferred_branch,
            city=city
        )
        
        return jsonify({
            'success': True,
            'preferred_branch': preferred_branch,
            'suggestions': suggestions
        })
        
    except Exception as e:
        print(f"❌ Suggestion Error: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@predict_bp.route('/api/compare', methods=['POST'])
def compare_colleges():
    """
    Compare specific colleges
    
    Expected JSON:
    {
        "rank": 191,
        "percentile": 99.98,
        "category": "OPEN",
        "colleges": [
            {"name": "COEP", "branch": "Computer"},
            {"name": "PICT", "branch": "Computer"}
        ]
    }
    """
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500
    
    try:
        data = request.json
        
        rank = data.get('rank')
        percentile = data.get('percentile')
        category = data.get('category', 'OPEN')
        colleges_to_compare = data.get('colleges', [])
        
        if not all([rank, percentile]) or not colleges_to_compare:
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        comparison_results = []
        
        for college in colleges_to_compare:
            college_name = college.get('name')
            branch = college.get('branch')
            
            # Get predictions for this specific college-branch
            predictions = predictor.predict_colleges(
                rank=int(rank),
                percentile=float(percentile),
                category=category,
                branch=branch,
                limit=100
            )
            
            # Find the specific college in results
            matching = [p for p in predictions if college_name.lower() in p['college_name'].lower()]
            
            if matching:
                comparison_results.append(matching[0])
        
        return jsonify({
            'success': True,
            'comparison': comparison_results
        })
        
    except Exception as e:
        print(f"❌ Comparison Error: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500