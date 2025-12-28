// D:\CET_Prediction\cet-web-app\frontend\src\pages\AssistantPage.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Sparkles, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // ✅ NEW: Import markdown renderer
import chatbotApi from '../services/chatbotApi';

export default function AssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]); // ✅ FIX: Initialize as empty array
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const greetingResponse = await chatbotApi.getGreeting();
      if (greetingResponse.success && greetingResponse.message) {
        setMessages([{
          role: 'assistant',
          content: greetingResponse.message, // ✅ FIX: Use normalized 'message' field
          timestamp: new Date()
        }]);
      }

      const repliesResponse = await chatbotApi.getQuickReplies();
      if (repliesResponse.success && repliesResponse.replies) {
        setQuickReplies(repliesResponse.replies); // ✅ FIX: Use normalized 'replies' field
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setMessages([{
        role: 'assistant',
        content: "Hi! 👋 I'm AdmitAssist AI. How can I help you with college admissions today?",
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    
    if (!textToSend.trim() || isLoading) return;

    const validation = chatbotApi.validateMessage(textToSend);
    if (!validation.isValid) {
      setError(validation.error);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const userMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    setShowQuickReplies(false);

    try {
      const history = chatbotApi.formatHistoryForAPI(messages);
      const response = await chatbotApi.sendMessage(textToSend, history);

      if (response.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (replyText) => {
    sendMessage(replyText);
  };

  const handleClearChat = async () => {
    try {
      await chatbotApi.clearConversation();
      setMessages([]);
      setShowQuickReplies(true);
      setQuickReplies([]); // ✅ FIX: Reset quick replies
      loadInitialData();
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">AdmitAssist AI</h1>
                  <p className="text-xs text-gray-500">Your 24/7 Admission Companion</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Messages */}
          <div className="h-full overflow-y-auto p-6" style={{ height: 'calc(100% - 80px)' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 mb-6 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-2xl ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                        : message.isError
                        ? 'bg-red-50 text-red-900 border border-red-200'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    {/* ✅ NEW: Render markdown for assistant messages */}
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            // Custom styling for markdown elements
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="text-sm" {...props} />,
                            p: ({node, ...props}) => <p className="text-sm leading-relaxed mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-bold mt-3 mb-2" {...props} />,
                            code: ({node, ...props}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">You</span>
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies - ✅ FIX: Safe check for array and length */}
            {showQuickReplies && Array.isArray(quickReplies) && quickReplies.length > 0 && !isLoading && (
              <div className="my-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick questions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={reply.id || index}
                      onClick={() => handleQuickReply(reply.text)}
                      className="text-left p-3 bg-white border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-sm font-medium text-gray-700"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-900 text-sm">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about admissions..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Powered by Gemini AI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}