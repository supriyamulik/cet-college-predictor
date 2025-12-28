
import { X, Minimize2, Maximize2, Sparkles, RotateCcw } from 'lucide-react';

const ChatHeader = ({ isMinimized, onMinimize, onClose, onClear }) => {
  return (
    <div className="chatbot-header">
      <div className="chatbot-header-info">
        <div className="chatbot-avatar-container">
          <div className="chatbot-avatar">
            <Sparkles className="avatar-icon" size={22} />
            <div className="avatar-pulse"></div>
          </div>
        </div>
        <div className="header-text">
          <h3 className="header-title">AdmitAssist AI</h3>
          <div className="header-status">
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
      </div>
      
      <div className="chatbot-header-actions">
        <button 
          className="header-action-btn"
          onClick={onClear}
          aria-label="Clear conversation"
          title="Clear chat"
        >
          <RotateCcw size={18} />
        </button>
        <button 
          className="header-action-btn"
          onClick={onMinimize}
          aria-label={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
        </button>
        <button 
          className="header-action-btn close-btn"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;