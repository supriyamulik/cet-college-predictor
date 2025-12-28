
import { Send } from 'lucide-react';

const ChatInput = ({ value, onChange, onSend, onKeyPress, isLoading }) => {
  return (
    <div className="chatbot-input-container">
      <div className="chatbot-input">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything about admissions..."
          disabled={isLoading}
          maxLength={1000}
          aria-label="Chat message input"
        />
        <button 
          type="button"
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          aria-label="Send message"
          className="send-button"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="input-hint">Press Enter to send</p>
    </div>
  );
};

export default ChatInput;