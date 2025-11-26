from flask import Blueprint, request, jsonify
from datetime import datetime
import json

optionform_bp = Blueprint('optionform', __name__)

# In-memory storage (replace with database later)
user_option_forms = {}

@optionform_bp.route('/api/optionform/save', methods=['POST'])
def save_option_form():
    """Save user's option form with priorities"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        form_data = data.get('form_data', [])
        
        if not user_id:
            return jsonify({'success': False, 'error': 'User ID required'}), 400
        
        # Store the form
        user_option_forms[user_id] = {
            'colleges': form_data,
            'updated_at': datetime.now().isoformat(),
            'total_colleges': len(form_data)
        }
        
        return jsonify({
            'success': True,
            'message': f'Option form saved with {len(form_data)} colleges',
            'form_id': user_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@optionform_bp.route('/api/optionform/load/<user_id>', methods=['GET'])
def load_option_form(user_id):
    """Load user's saved option form"""
    try:
        form_data = user_option_forms.get(user_id, {'colleges': []})
        return jsonify({
            'success': True,
            'form_data': form_data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@optionform_bp.route('/api/optionform/export/<user_id>', methods=['GET'])
def export_option_form(user_id):
    """Export option form as CSV/JSON"""
    try:
        form_data = user_option_forms.get(user_id, {'colleges': []})
        
        # Create CSV format
        csv_data = "Priority,College Name,Branch,City,Type,Category,Historical Cutoff,Predicted Cutoff,Admission Probability\n"
        
        for idx, college in enumerate(form_data['colleges'], 1):
            csv_data += f'{idx},{college.get("college_name", "")},{college.get("branch", "")},{college.get("city", "")},{college.get("type", "")},{college.get("quota_category", "")},{college.get("historical_cutoff", "")},{college.get("predicted_cutoff", "")},{college.get("admission_probability", "")}\n'
        
        return jsonify({
            'success': True,
            'csv_data': csv_data,
            'json_data': form_data,
            'total_colleges': len(form_data['colleges'])
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500