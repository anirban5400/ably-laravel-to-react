import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import components
import ChatTesting from '../components/ChatTesting';
import NotificationTest from '../components/NotificationTest';
import LiveStatusTesting from '../components/LiveStatusTesting';
import DirectChat from '../components/DirectChat';

// Import lazy realtime setup
import { initializeRealtime } from '../utils/lazy-realtime-setup';

/**
 * RealtimePlayground Page Component
 * Contains all the real-time feature testing functionality
 */
const RealtimePlayground = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  // Initialize realtime connection when component mounts
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        setIsConnecting(true);
        setConnectionError(null);
        await initializeRealtime();
      } catch (error) {
        console.error('Failed to initialize realtime connection:', error);
        setConnectionError('Failed to connect to realtime services');
      } finally {
        setIsConnecting(false);
      }
    };

    setupRealtime();
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  // Show loading state while connecting
  if (isConnecting) {
    return (
      <div className="playground-page">
        <div className="playground-header">
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h2 className="playground-title">Realtime Feature Playground</h2>
        </div>
        
        <div className="connection-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Connecting to realtime services...</p>
        </div>
      </div>
    );
  }

  // Show error state if connection failed
  if (connectionError) {
    return (
      <div className="playground-page">
        <div className="playground-header">
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h2 className="playground-title">Realtime Feature Playground</h2>
        </div>
        
        <div className="connection-error">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Connection Failed</h3>
          <p className="error-message">{connectionError}</p>
          <button 
            className="btn primary" 
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="playground-page">
      <div className="playground-header">
        <button className="back-button" onClick={handleBackToHome}>
          ← Back to Home
        </button>
        <h2 className="playground-title">Realtime Feature Playground</h2>
        <p className="playground-subtitle">
          Test real-time messaging, notifications, status updates, and direct chat functionality
        </p>
      </div>
      
      {/* Top row with 3 cards */}
      <div className="grid">
        <ChatTesting />
        <NotificationTest />
        <LiveStatusTesting />
      </div>

      {/* Bottom card - Direct chat */}
      <DirectChat />
    </div>
  );
};

export default RealtimePlayground;
