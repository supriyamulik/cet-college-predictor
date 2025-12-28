
import { Sparkles, User } from 'lucide-react';

const ChatMessage = ({ message, isLast }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`message ${message.role} ${isLast ? 'last' : ''} ${isError ? 'error' : ''}`}>
      {!isUser && (
        <div className="message-avatar">
          <Sparkles className="avatar-icon" size={16} />
        </div>
      )}
      
      <div className="message-content">
        <p className="message-text">{message.content}</p>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>

      {isUser && (
        <div className="message-avatar user-avatar">
          <User size={16} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;