import React from 'react';
import { useChat } from '../hooks/useChat';

/**
 * ChatTesting Component
 * Handles real-time messaging functionality
 */
const ChatTesting = () => {
  const {
    message,
    setMessage,
    messages,
    sendMessage,
    isLoading
  } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="card-box">
      <h3 className="card-title">Chat testing</h3>
      <p className="muted">
        Open this page in two browsers and send a message to see it arrive live.
      </p>
      <hr className="divider" />
      <p className="subtitle">Simple Livewire + Ably Demo</p>
      <p className="muted small">
        Open two tabs to see messages arrive in real-time.
      </p>
      
      <div className="messages">
        {messages.length === 0 ? (
          <div className="muted small">No messages yet. Send a message to get started!</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="msg">{msg}</div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="row">
        <input
          className="input"
          placeholder="Type a message."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn primary"
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatTesting;
