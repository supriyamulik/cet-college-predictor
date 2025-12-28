# backend/routes/chatbot_route.py

from flask import Blueprint, request, jsonify
from services.chatbot_service import ChatbotService
from typing import Dict, List

chatbot_bp = Blueprint('chatbot', __name__)

# Initialize chatbot service
print("🔍 Attempting to initialize ChatbotService...")
try:
    chatbot_service = ChatbotService()
    if hasattr(chatbot_service, 'is_configured'):
        if chatbot_service.is_configured:
            print("✅ Chatbot service initialized successfully")
        else:
            print("⚠️  Chatbot service initialized but not configured (missing API key)")
    else:
        print("⚠️  Chatbot service missing 'is_configured' attribute")
except Exception as e:
    print(f"❌ Failed to initialize chatbot service: {str(e)}")
    import traceback
    traceback.print_exc()
    chatbot_service = None

# In-memory conversation storage (session-based)
conversations: Dict[str, List[Dict]] = {}


@chatbot_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    if chatbot_service and chatbot_service.is_configured:
        return jsonify({
            'status': 'healthy',
            'service': 'operational',
            'message': 'Chatbot service is running'
        }), 200
    else:
        return jsonify({
            'status': 'unavailable',
            'service': 'not_configured',
            'message': 'Chatbot service requires GEMINI_API_KEY configuration',
            'instruction': 'Add GEMINI_API_KEY to backend/.env file'
        }), 503


@chatbot_bp.route('/greeting', methods=['GET'])
def get_greeting():
    """Get greeting message"""
    try:
        if not chatbot_service:
            return jsonify({
                'success': False,
                'error': 'Chatbot service not initialized'
            }), 503

        greeting = chatbot_service.get_greeting_message()
        
        return jsonify({
            'success': True,
            'greeting': greeting,
            'configured': chatbot_service.is_configured
        }), 200

    except Exception as e:
        print(f"❌ Error getting greeting: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@chatbot_bp.route('/quick-replies', methods=['GET'])
def get_quick_replies():
    """Get quick reply suggestions"""
    try:
        if not chatbot_service:
            return jsonify({
                'success': False,
                'error': 'Chatbot service not initialized'
            }), 503

        quick_replies = chatbot_service.get_quick_replies()
        
        return jsonify({
            'success': True,
            'quickReplies': quick_replies,
            'configured': chatbot_service.is_configured
        }), 200

    except Exception as e:
        print(f"❌ Error getting quick replies: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        # Check if service is available
        if not chatbot_service:
            return jsonify({
                'success': False,
                'error': 'Chatbot service not initialized',
                'response': 'Sorry, the chatbot service is currently unavailable.'
            }), 503

        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        message = data.get('message', '').strip()
        session_id = data.get('sessionId', 'default')

        # Validate message
        is_valid, error_msg = chatbot_service.validate_message(message)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_msg
            }), 400

        # Get or create conversation history
        if session_id not in conversations:
            conversations[session_id] = []

        conversation_history = conversations[session_id]

        # Get AI response
        response = chatbot_service.get_response(
            message=message,
            conversation_history=conversation_history
        )

        # Update conversation history
        conversation_history.append({
            'role': 'user',
            'content': message,
            'timestamp': None
        })
        conversation_history.append({
            'role': 'assistant',
            'content': response,
            'timestamp': None
        })

        # Keep only last 20 messages
        if len(conversation_history) > 20:
            conversations[session_id] = conversation_history[-20:]

        return jsonify({
            'success': True,
            'response': response,
            'sessionId': session_id,
            'configured': chatbot_service.is_configured
        }), 200

    except Exception as e:
        print(f"❌ Error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': 'Failed to process message',
            'response': 'Sorry, I encountered an error. Please try again.'
        }), 500


@chatbot_bp.route('/clear', methods=['POST'])
def clear_conversation():
    """Clear conversation history"""
    try:
        # ✅ FIX: Handle both JSON and no-body requests
        data = request.get_json(silent=True) or {}
        session_id = data.get('sessionId', 'default')

        if session_id in conversations:
            del conversations[session_id]
            print(f"✅ Cleared conversation for session: {session_id}")

        return jsonify({
            'success': True,
            'message': 'Conversation cleared',
            'sessionId': session_id
        }), 200

    except Exception as e:
        print(f"❌ Error clearing conversation: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500