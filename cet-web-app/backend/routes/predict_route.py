from flask import Blueprint, request, jsonify
from services.predictor import CollegePredictor
import traceback

# ==========================================
# Blueprint Setup
# ==========================================
predict_bp = Blueprint('predict', __name__)

# Initialize Predictor
try:
    predictor = CollegePredictor()
    print("✅ College Predictor initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize predictor: {e}")
    traceback.print_exc()
    predictor = None


# ==========================================
# Main Prediction Endpoint
# ==========================================
@predict_bp.route('/api/predict', methods=['POST'])
def predict_colleges():
    """
    Main ML prediction endpoint for option form
    
    Body:
    {
        "rank": 5000,
        "percentile": 99.98,
        "category": "OPEN",
        "city": "Pune",
        "branches": ["Computer Engineering"]
    }
    
    Returns colleges sorted by historical cutoff (high to low)
    """
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500

    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        # Extract parameters
        rank = data.get('rank')
        percentile = data.get('percentile')
        category = data.get('category', 'OPEN').upper()
        city = data.get('city')
        branches = data.get('branches', [])

        # Validate
        if rank is None or percentile is None:
            return jsonify({
                'success': False,
                'error': 'Rank and percentile are required'
            }), 400

        if not isinstance(rank, (int, float)) or rank <= 0:
            return jsonify({
                'success': False,
                'error': 'Invalid rank'
            }), 400

        if not isinstance(percentile, (int, float)) or not (0 <= percentile <= 100):
            return jsonify({
                'success': False,
                'error': 'Percentile must be between 0 and 100'
            }), 400

        # Make prediction
        if branches and len(branches) > 0:
            predictions = predictor.predict_multiple_branches(
                rank=int(rank),
                percentile=float(percentile),
                category=category,
                branches=branches,
                city=city,
                limit=100
            )
        else:
            predictions = predictor.predict_colleges(
                rank=int(rank),
                percentile=float(percentile),
                category=category,
                city=city,
                limit=100
            )

        # Calculate statistics
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
            'predictions': predictions,
            'sorting': 'Historical Cutoff (High to Low) - Option Form Order'
        })

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ==========================================
# Model Info Endpoint
# ==========================================
@predict_bp.route('/api/model-info', methods=['GET'])
def model_info():
    """Get model and dataset information"""
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


# ==========================================
# Filters Endpoint
# ==========================================
@predict_bp.route('/api/filters', methods=['GET'])
def get_filters():
    """Get available branches, cities, categories"""
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500

    try:
        return jsonify({
            'success': True,
            'branches': predictor.available_branches,
            'cities': predictor.available_cities,
            'categories': predictor.available_categories
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ==========================================
# Search Colleges Endpoint
# ==========================================
@predict_bp.route('/api/search', methods=['GET'])
def search_colleges():
    """
    Search colleges/branches/cities
    Query: ?q=COEP&type=college
    """
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500

    try:
        query = request.args.get('q', '').lower()
        search_type = request.args.get('type', 'college')

        if not query:
            return jsonify({
                'success': False,
                'error': 'Query parameter "q" required'
            }), 400

        results = []

        if search_type == 'college':
            matching = predictor.college_data[
                predictor.college_data['college_name'].str.contains(query, case=False, na=False)
            ]['college_name'].unique().tolist()
            results = matching[:20]

        elif search_type == 'branch':
            results = [b for b in predictor.available_branches if query in b.lower()][:20]

        elif search_type == 'city':
            results = [c for c in predictor.available_cities if query in c.lower()][:20]

        return jsonify({
            'success': True,
            'query': query,
            'type': search_type,
            'results': results,
            'total': len(results)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ==========================================
# Statistics Endpoint
# ==========================================
@predict_bp.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get dataset statistics"""
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized'
        }), 500

    try:
        stats = predictor.get_college_info()
        return jsonify({
            'success': True,
            'statistics': stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500