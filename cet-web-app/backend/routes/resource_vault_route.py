# backend/routes/resource_vault_route.py
from flask import Blueprint, jsonify, request
from services.resource_service import ResourceService
from functools import wraps

# Create Blueprint
resource_vault_bp = Blueprint('resource_vault', __name__, url_prefix='/api/resources')

# Initialize service
resource_service = ResourceService()


# Error handler decorator
def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({
                'success': False,
                'error': 'Invalid input',
                'message': str(e)
            }), 400
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': str(e)
            }), 500
    return decorated_function


# ============= DOCUMENTS ROUTES =============

@resource_vault_bp.route('/documents', methods=['GET'])
@handle_errors
def get_documents():
    """Get all documents or search documents"""
    search_query = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip().lower()
    
    if search_query:
        # Search documents
        results = resource_service.search_documents(search_query)
        return jsonify({
            'success': True,
            'data': results,
            'search_query': search_query
        }), 200
    
    elif category and category in ['application', 'counselling']:
        # Get documents by category
        data = resource_service.get_documents_by_category(category)
        return jsonify({
            'success': True,
            'data': data,
            'category': category
        }), 200
    
    else:
        # Get all documents
        data = resource_service.get_all_documents()
        return jsonify({
            'success': True,
            'data': data
        }), 200


@resource_vault_bp.route('/documents/<category>', methods=['GET'])
@handle_errors
def get_documents_by_category(category):
    """Get documents for a specific category"""
    if category.lower() not in ['application', 'counselling']:
        return jsonify({
            'success': False,
            'error': 'Invalid category',
            'message': 'Category must be either "application" or "counselling"'
        }), 400
    
    data = resource_service.get_documents_by_category(category)
    
    if not data:
        return jsonify({
            'success': False,
            'error': 'Not found',
            'message': f'No documents found for category: {category}'
        }), 404
    
    return jsonify({
        'success': True,
        'data': data,
        'category': category
    }), 200


# ============= SCHOLARSHIPS ROUTES =============

@resource_vault_bp.route('/scholarships', methods=['GET'])
@handle_errors
def get_scholarships():
    """Get all scholarships or search scholarships"""
    search_query = request.args.get('search', '').strip()
    
    if search_query:
        # Search scholarships
        results = resource_service.search_scholarships(search_query)
        return jsonify({
            'success': True,
            'data': results,
            'count': len(results),
            'search_query': search_query
        }), 200
    else:
        # Get all scholarships
        data = resource_service.get_all_scholarships()
        return jsonify({
            'success': True,
            'data': data,
            'count': len(data)
        }), 200


@resource_vault_bp.route('/scholarships/<int:scholarship_id>', methods=['GET'])
@handle_errors
def get_scholarship_by_id(scholarship_id):
    """Get a specific scholarship by ID"""
    scholarship = resource_service.get_scholarship_by_id(scholarship_id)
    
    if not scholarship:
        return jsonify({
            'success': False,
            'error': 'Not found',
            'message': f'Scholarship with ID {scholarship_id} not found'
        }), 404
    
    return jsonify({
        'success': True,
        'data': scholarship
    }), 200


# ============= LINKS ROUTES =============

@resource_vault_bp.route('/links', methods=['GET'])
@handle_errors
def get_links():
    """Get all important links or links by category"""
    category = request.args.get('category', '').strip().lower()
    
    if category:
        # Get links by category
        if category not in ['official', 'application', 'counselling', 'useful']:
            return jsonify({
                'success': False,
                'error': 'Invalid category',
                'message': 'Category must be one of: official, application, counselling, useful'
            }), 400
        
        data = resource_service.get_links_by_category(category)
        return jsonify({
            'success': True,
            'data': data,
            'category': category,
            'count': len(data)
        }), 200
    else:
        # Get all links
        data = resource_service.get_all_links()
        return jsonify({
            'success': True,
            'data': data
        }), 200


@resource_vault_bp.route('/links/<category>', methods=['GET'])
@handle_errors
def get_links_by_category(category):
    """Get links for a specific category"""
    if category.lower() not in ['official', 'application', 'counselling', 'useful']:
        return jsonify({
            'success': False,
            'error': 'Invalid category',
            'message': 'Category must be one of: official, application, counselling, useful'
        }), 400
    
    data = resource_service.get_links_by_category(category)
    
    return jsonify({
        'success': True,
        'data': data,
        'category': category,
        'count': len(data)
    }), 200


# ============= CONTACTS ROUTES =============

@resource_vault_bp.route('/contacts', methods=['GET'])
@handle_errors
def get_contacts():
    """Get all contact information"""
    data = resource_service.get_all_contacts()
    
    return jsonify({
        'success': True,
        'data': data
    }), 200


@resource_vault_bp.route('/contacts/helplines', methods=['GET'])
@handle_errors
def get_helplines():
    """Get helpline contacts only"""
    data = resource_service.get_all_contacts()
    
    return jsonify({
        'success': True,
        'data': data.get('helplines', []),
        'count': len(data.get('helplines', []))
    }), 200


@resource_vault_bp.route('/contacts/offices', methods=['GET'])
@handle_errors
def get_offices():
    """Get office contacts only"""
    data = resource_service.get_all_contacts()
    
    return jsonify({
        'success': True,
        'data': data.get('offices', []),
        'count': len(data.get('offices', []))
    }), 200


# ============= IMPORTANT DATES ROUTES =============

@resource_vault_bp.route('/dates', methods=['GET'])
@handle_errors
def get_dates():
    """Get all important dates or dates by phase"""
    phase = request.args.get('phase', '').strip().lower()
    status = request.args.get('status', '').strip().lower()
    
    if status == 'upcoming':
        # Get only upcoming dates
        data = resource_service.get_upcoming_dates()
        return jsonify({
            'success': True,
            'data': data,
            'count': len(data),
            'status': 'upcoming'
        }), 200
    
    elif phase:
        # Get dates by phase
        if phase not in ['application', 'exam', 'results', 'counselling']:
            return jsonify({
                'success': False,
                'error': 'Invalid phase',
                'message': 'Phase must be one of: application, exam, results, counselling'
            }), 400
        
        data = resource_service.get_dates_by_phase(phase)
        return jsonify({
            'success': True,
            'data': data,
            'phase': phase,
            'count': len(data)
        }), 200
    else:
        # Get all dates
        data = resource_service.get_all_dates()
        return jsonify({
            'success': True,
            'data': data
        }), 200


@resource_vault_bp.route('/dates/<phase>', methods=['GET'])
@handle_errors
def get_dates_by_phase(phase):
    """Get dates for a specific phase"""
    if phase.lower() not in ['application', 'exam', 'results', 'counselling']:
        return jsonify({
            'success': False,
            'error': 'Invalid phase',
            'message': 'Phase must be one of: application, exam, results, counselling'
        }), 400
    
    data = resource_service.get_dates_by_phase(phase)
    
    return jsonify({
        'success': True,
        'data': data,
        'phase': phase,
        'count': len(data)
    }), 200


@resource_vault_bp.route('/dates/upcoming', methods=['GET'])
@handle_errors
def get_upcoming_dates():
    """Get all upcoming important dates"""
    data = resource_service.get_upcoming_dates()
    
    return jsonify({
        'success': True,
        'data': data,
        'count': len(data)
    }), 200


# ============= TIPS ROUTES =============

@resource_vault_bp.route('/tips', methods=['GET'])
@handle_errors
def get_tips():
    """Get all tips or tips by category"""
    category = request.args.get('category', '').strip()
    
    if category:
        # Get tips by category
        valid_categories = ['Application', 'Documents', 'Counselling', 'Fees', 'General']
        if category not in valid_categories:
            return jsonify({
                'success': False,
                'error': 'Invalid category',
                'message': f'Category must be one of: {", ".join(valid_categories)}'
            }), 400
        
        data = resource_service.get_tips_by_category(category)
        return jsonify({
            'success': True,
            'data': data,
            'category': category,
            'count': len(data)
        }), 200
    else:
        # Get all tips
        data = resource_service.get_all_tips()
        return jsonify({
            'success': True,
            'data': data,
            'count': len(data)
        }), 200


@resource_vault_bp.route('/tips/<category>', methods=['GET'])
@handle_errors
def get_tips_by_category(category):
    """Get tips for a specific category"""
    valid_categories = ['Application', 'Documents', 'Counselling', 'Fees', 'General']
    
    if category not in valid_categories:
        return jsonify({
            'success': False,
            'error': 'Invalid category',
            'message': f'Category must be one of: {", ".join(valid_categories)}'
        }), 400
    
    data = resource_service.get_tips_by_category(category)
    
    return jsonify({
        'success': True,
        'data': data,
        'category': category,
        'count': len(data)
    }), 200


# ============= SUMMARY/DASHBOARD ROUTES =============

@resource_vault_bp.route('/summary', methods=['GET'])
@handle_errors
def get_summary():
    """Get summary statistics for dashboard"""
    data = resource_service.get_dashboard_summary()
    
    return jsonify({
        'success': True,
        'data': data
    }), 200


# ============= HEALTH CHECK =============

@resource_vault_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Resource Vault API is running',
        'endpoints': {
            'documents': '/api/resources/documents',
            'scholarships': '/api/resources/scholarships',
            'links': '/api/resources/links',
            'contacts': '/api/resources/contacts',
            'dates': '/api/resources/dates',
            'tips': '/api/resources/tips',
            'summary': '/api/resources/summary'
        }
    }), 200


# Error handlers for the blueprint
@resource_vault_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Not found',
        'message': 'The requested resource was not found'
    }), 404


@resource_vault_bp.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'error': 'Method not allowed',
        'message': 'The method is not allowed for the requested URL'
    }), 405


@resource_vault_bp.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An internal error occurred'
    }), 500