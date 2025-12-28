# backend/services/chatbot_service.py

import os
from typing import List, Dict, Optional
from datetime import datetime

import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


class ChatbotService:
    def __init__(self):
        """Initialize Gemini Flash chatbot service"""

        api_key = os.getenv("GEMINI_API_KEY")

        # ✅ DEBUG: Print what we got
        print(f"🔍 ChatbotService.__init__ called")
        print(f"   API Key present: {bool(api_key)}")
        if api_key:
            print(f"   API Key length: {len(api_key)}")
            print(f"   API Key starts with: {api_key[:15]}...")

        # ✅ FIX: Don't raise exception, just mark as unconfigured
        if not api_key:
            print("⚠️  WARNING: GEMINI_API_KEY not found in environment variables")
            print("   Add GEMINI_API_KEY to backend/.env file")
            self.is_configured = False
            self.model = None
            return

        try:
            # Configure Gemini API
            genai.configure(api_key=api_key)

            # ✅ FIX: Use correct safety settings format
            from google.generativeai.types import HarmCategory, HarmBlockThreshold
            
            safety_settings = {
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            }

            # Initialize Gemini Flash model
            # ✅ FIX: Use models/gemini-2.5-flash (latest available)
            self.model = genai.GenerativeModel(
                model_name="models/gemini-2.5-flash",
                safety_settings=safety_settings,
            )

            self.is_configured = True
            print("✅ Gemini chatbot service initialized successfully")

        except Exception as e:
            print(f"❌ Error initializing Gemini: {str(e)}")
            import traceback
            traceback.print_exc()
            self.is_configured = False
            self.model = None
            return

        # System prompt
        self.system_prompt = (
            "You are AdmitAssist AI, a friendly and knowledgeable college admission assistant "
            "for the CET Insights platform in India.\n\n"
            "You help students with:\n"
            "- CET, JEE, NEET exam guidance\n"
            "- Engineering & medical admissions\n"
            "- Cut-offs, ranks, and percentiles\n"
            "- College comparisons\n"
            "- Counseling and documentation\n\n"
            "Guidelines:\n"
            "- Be comprehensive and complete in your responses\n"
            "- Use bullet points and numbering for better readability\n"
            "- Give actionable, step-by-step advice when appropriate\n"
            "- Always finish your complete thought - don't cut off mid-sentence\n"
            "- Admit uncertainty and suggest official sources if needed\n\n"
            "Academic year: 2024–2025\n"
        )

    # ----------------------------------------------------
    # MAIN CHAT RESPONSE
    # ----------------------------------------------------
    def get_response(
        self,
        message: str,
        conversation_history: Optional[List[Dict]] = None,
    ) -> str:
        """Get AI response for user message"""
        
        # ✅ FIX: Check if service is configured
        if not self.is_configured or not self.model:
            return (
                "⚠️ AI chatbot is not configured. "
                "Please add GEMINI_API_KEY to the backend/.env file. "
                "Contact the administrator for assistance."
            )

        try:
            context = self.system_prompt + "\n"

            # Add conversation history (last 10 messages)
            if conversation_history:
                context += "Previous conversation:\n"
                for msg in conversation_history[-10:]:
                    role = "Student" if msg.get("role") == "user" else "AdmitAssist"
                    content = msg.get("content", "")
                    context += f"{role}: {content}\n"
                context += "\n"

            context += f"Student: {message}\nAdmitAssist:"

            response = self.model.generate_content(
                context,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    top_p=0.9,
                    top_k=40,
                    max_output_tokens=2048,  # ✅ FIX: Increased to 2048 for longer responses
                ),
            )

            if response and response.text:
                return response.text.strip()

            return self._fallback_response()

        except Exception as e:
            print(f"[ChatbotService ERROR]: {e}")
            return self._error_response(str(e))

    # ----------------------------------------------------
    # HELPERS
    # ----------------------------------------------------
    def validate_message(self, message: str) -> tuple[bool, Optional[str]]:
        """Validate user message"""
        if not message or not message.strip():
            return False, "Message cannot be empty"

        if len(message) > 1000:
            return False, "Message too long (max 1000 characters)"

        return True, None

    def get_greeting_message(self) -> str:
        """Get greeting message"""
        # ✅ FIX: Return different greeting if not configured
        if not self.is_configured:
            return (
                "⚠️ AI Chatbot Configuration Required\n\n"
                "The chatbot service needs to be configured with a Gemini API key. "
                "Please contact the administrator.\n\n"
                "In the meantime, you can:\n"
                "• Browse college information\n"
                "• Use the college comparison tool\n"
                "• Check admission cutoffs"
            )
        
        return (
            "Hi 👋 I'm AdmitAssist AI!\n\n"
            "I can help you with:\n"
            "✓ CET, JEE, NEET exam info\n"
            "✓ College admissions guidance\n"
            "✓ Cut-off ranks & predictions\n"
            "✓ Course and college comparisons\n\n"
            "What would you like to know?"
        )

    def get_quick_replies(self) -> List[Dict[str, str]]:
        """Get quick reply suggestions"""
        # ✅ FIX: Return empty list if not configured
        if not self.is_configured:
            return []
            
        return [
            {"id": "cet", "text": "What is CET exam?", "category": "Entrance Exams"},
            {"id": "apply", "text": "How to apply for engineering colleges?", "category": "Admissions"},
            {"id": "cutoff", "text": "How are cut-offs decided?", "category": "Cut-offs"},
            {"id": "compare", "text": "Compare engineering colleges", "category": "College Info"},
            {"id": "dates", "text": "Important admission dates", "category": "Schedules"},
        ]

    def _fallback_response(self) -> str:
        """Fallback response when AI fails"""
        return (
            "I'm having a little trouble responding right now. "
            "Please try again in a moment 😊"
        )

    def _error_response(self, error: str) -> str:
        """Generate user-friendly error message"""
        error_lower = error.lower()

        if "quota" in error_lower or "limit" in error_lower:
            return "I'm getting a lot of requests right now. Please try again shortly."
        if "api key" in error_lower:
            return "There's a configuration issue. Please contact support."
        return "Something went wrong. Please try again later."