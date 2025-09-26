import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import LandingPage from './pages/LandingPage';
import RealtimePlayground from './pages/RealtimePlayground';

// Import components
import Navigation from './components/Navigation';

/**
 * Main App Component
 * Handles routing and navigation for the application
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/realtime-feature-playground" element={<RealtimePlayground />} />
            {/* Future routes can be added here */}
            {/* <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
