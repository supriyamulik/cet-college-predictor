// ============================================
// FILE 1: Chatbot.jsx
// D:\CET_Prediction\cet-web-app\frontend\src\components\Chatbot\Chatbot.jsx
// ============================================

import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, Sparkles, RotateCcw } from 'lucide-react';
import chatbotApi from '../../services/chatbotApi';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load greeting and quick replies when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      // Get greeting message
      const greetingResponse = await chatbotApi.getGreeting();
      if (greetingResponse.success) {
        setMessages([{
          role: 'assistant',
          content: greetingResponse.message,
          timestamp: new Date()
        }]);
      }

      // Get quick replies
      const repliesResponse = await chatbotApi.getQuickReplies();
      if (repliesResponse.success) {
        setQuickReplies(repliesResponse.replies);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Fallback greeting
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

    // Validate message
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
      // Format history for API
      const history = chatbotApi.formatHistoryForAPI(messages);
      
      // Send message to API
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

  return (
    <>
      {/* Chatbot Toggle Button with Animation */}
      {!isOpen && (
        <button 
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open AdmitAssist AI"
        >
          <div className="toggle-icon-wrapper">
            <Sparkles className="toggle-icon" size={28} />
          </div>
          <span className="chatbot-pulse"></span>
          <span className="chatbot-badge">AI</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
          <ChatHeader 
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => setIsOpen(false)}
            onClear={handleClearChat}
          />

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index}
                    message={message}
                    isLast={index === messages.length - 1}
                  />
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="message assistant">
                    <div className="message-avatar">
                      <Sparkles className="avatar-icon pulse" size={18} />
                    </div>
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Replies */}
                {showQuickReplies && quickReplies.length > 0 && !isLoading && (
                  <div className="quick-replies-container">
                    <p className="quick-replies-title">Quick questions:</p>
                    <div className="quick-replies">
                      {quickReplies.slice(0, 4).map((reply, index) => (
                        <button
                          key={reply.id || index}
                          className="quick-reply-btn"
                          onClick={() => handleQuickReply(reply.text)}
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="error-banner">
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <ChatInput 
                value={inputMessage}
                onChange={setInputMessage}
                onSend={sendMessage}
                onKeyPress={handleKeyPress}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;