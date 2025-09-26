import React from 'react';
import './App.css';

// Import components
import ChatTesting from './components/ChatTesting';
import NotificationTest from './components/NotificationTest';
import LiveStatusTesting from './components/LiveStatusTesting';
import DirectChat from './components/DirectChat';

/**
 * Main App Component
 * Orchestrates the Realtime Feature Playground with 4 main features
 */
function App() {
  return (
    <div className="page">
      <h2 className="heading">Realtime Feature Playground</h2>
      
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
}

export default App
