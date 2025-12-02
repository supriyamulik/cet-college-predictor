# routes/college_directory.py

from flask import Blueprint, jsonify, request, current_app
import pandas as pd
import os
from datetime import datetime
import numpy as np

college_directory_bp = Blueprint('college_directory', __name__)

# Simple college directory - just reads your Excel file
@college_directory_bp.route('/colleges/directory', methods=['GET'])
def get_college_directory():
    """Simple endpoint to get college directory data"""
    try:
        # Try different file paths
        file_paths = [
            'data/Colleges_URL.xlsx',
            'backend/data/Colleges_URL.xlsx',
            os.path.join(os.path.dirname(__file__), '..', 'data', 'Colleges_URL.xlsx')
        ]
        
        df = None
        found_path = None
        
        for path in file_paths:
            if os.path.exists(path):
                df = pd.read_excel(path)
                found_path = os.path.abspath(path)
                break
        
        if df is None:
            return jsonify({
                'success': False,
                'error': 'College directory file not found',
                'searched_paths': file_paths,
                'current_dir': os.getcwd()
            }), 404
        
        # Clean the data
        df = df.where(pd.notna(df), '')
        
        # Convert to list of colleges
        colleges = []
        for _, row in df.iterrows():
            college = {
                'Sr. No': str(row.get('Sr. No', '')),
                'College Code': str(row.get('College Code', '')).strip(),
                'College Name': str(row.get('College Name', '')).strip(),
                'City': str(row.get('City', '')).strip(),
                'URL': str(row.get('URL', '')).strip()
            }
            colleges.append(college)
        
        # Get unique cities
        cities = sorted(set([c['City'] for c in colleges if c['City']]))
        
        return jsonify({
            'success': True,
            'colleges': colleges,
            'total': len(colleges),
            'cities': cities,
            'file_path': found_path,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@college_directory_bp.route('/colleges/filter', methods=['GET'])
def filter_colleges():
    """Simple filter endpoint"""
    try:
        city = request.args.get('city', 'ALL')
        search = request.args.get('search', '').lower()
        
        # Get all colleges first
        all_response = get_college_directory()
        if isinstance(all_response, tuple):  # Error response
            return all_response
        
        colleges = all_response.json['colleges']
        
        # Apply filters
        filtered = []
        for college in colleges:
            # City filter
            if city != 'ALL' and college['City'] != city:
                continue
            
            # Search filter
            if search:
                college_name = college['College Name'].lower()
                college_code = college['College Code'].lower()
                
                if search not in college_name and search not in college_code:
                    continue
            
            filtered.append(college)
        
        return jsonify({
            'success': True,
            'colleges': filtered,
            'total': len(filtered),
            'filters': {
                'city': city,
                'search': search
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@college_directory_bp.route('/colleges/stats', methods=['GET'])
def get_college_stats():
    """Get simple statistics"""
    try:
        response = get_college_directory()
        if isinstance(response, tuple):  # Error response
            return response
        
        colleges = response.json['colleges']
        
        # Calculate statistics
        cities = set([c['City'] for c in colleges if c['City']])
        has_website = sum(1 for c in colleges if c['URL'] and c['URL'].strip())
        
        return jsonify({
            'success': True,
            'statistics': {
                'total_colleges': len(colleges),
                'total_cities': len(cities),
                'colleges_with_website': has_website,
                'website_coverage': f'{(has_website / len(colleges) * 100):.1f}%' if colleges else '0%'
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@college_directory_bp.route('/colleges/<college_code>/add-to-form', methods=['POST'])
def add_to_option_form(college_code):
    """Add a college to the option form"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'default')
        college_data = data.get('college_data', {})
        
        # Get historical cutoff (you can add this logic later)
        historical_cutoff = 0  # Placeholder
        
        # Create college object for option form
        option_form_college = {
            'college_name': college_data.get('College Name', ''),
            'college_code': college_code,
            'city': college_data.get('City', ''),
            'type': 'Unknown',  # You can add this to your Excel file
            'branch': 'Computer Engineering',  # Default
            'branch_code': f'{college_code}_COMP_{datetime.now().timestamp()}',
            'historical_cutoff': historical_cutoff,
            'quota_category': 'OPEN',
            'search_category': 'GOPENS',
            'added_from_directory': True,
            'added_at': datetime.now().isoformat()
        }
        
        # Here you would save to your option form storage
        # For now, return success
        return jsonify({
            'success': True,
            'message': f'Added {college_data.get("College Name", "college")} to option form',
            'college': option_form_college
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500