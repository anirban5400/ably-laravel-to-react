import React from 'react';
import { useDirectChat } from '../hooks/useDirectChat';

/**
 * DirectChat Component
 * Handles user-to-user direct messaging functionality
 */
const DirectChat = () => {
  const {
    messages,
    formData,
    isConnected,
    connectToChannel,
    sendDirectMessage,
    updateFormData,
    isLoading
  } = useDirectChat();

  const handleConnect = () => {
    if (!formData.ownUserId.trim()) {
      alert('Please enter your User ID');
      return;
    }
    connectToChannel(formData.ownUserId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!formData.message.trim() || isLoading || !isConnected) return;

    try {
      await sendDirectMessage(formData.ownUserId, formData.peerUserId, formData.message);
      updateFormData('message', '');
    } catch (error) {
      console.error('Failed to send direct message:', error);
    }
  };

  const handleInputChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="direct">
      <h3>Direct chat (user ↔ user)</h3>
      <p className="muted">
        Enter your own user ID and the peer's user ID to chat one-to-one.
      </p>
      
      <div className="row">
        <input
          className="input"
          placeholder="Your User ID."
          value={formData.ownUserId}
          onChange={handleInputChange('ownUserId')}
          disabled={isLoading}
        />
        <input
          className="input"
          placeholder="Chat with User ID"
          value={formData.peerUserId}
          onChange={handleInputChange('peerUserId')}
          disabled={isLoading}
        />
        <button
          className="btn primary wide"
          onClick={handleConnect}
          disabled={isLoading || !formData.ownUserId.trim()}
        >
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
      </div>

      <div className="direct-panel">
        <div className="label">Direct messages:</div>
        <div className="direct-messages" id="dm-log">
          {messages.length === 0 ? (
            <div className="muted small">
              {isConnected ? 'No messages yet. Start chatting!' : 'Connect to start chatting.'}
            </div>
          ) : (
            messages.map((message, idx) => (
              <div key={idx}>{message}</div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="row">
          <input
            className="input"
            placeholder="Type a message."
            value={formData.message}
            onChange={handleInputChange('message')}
            onKeyPress={handleKeyPress}
            disabled={isLoading || !isConnected}
          />
          <button
            type="submit"
            className="btn primary"
            disabled={!formData.message.trim() || isLoading || !isConnected}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DirectChat;
