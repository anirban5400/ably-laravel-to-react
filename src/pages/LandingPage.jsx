import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

/**
 * LandingPage Component
 * Main landing page with feature cards for navigation
 */
const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'realtime-playground',
      title: 'Realtime Feature Playground',
      description: 'Test real-time messaging, notifications, status updates, and direct chat functionality.',
      icon: '🚀',
      route: '/realtime-feature-playground',
      color: 'primary'
    },
    // Future features can be added here
    // {
    //   id: 'analytics-dashboard',
    //   title: 'Analytics Dashboard',
    //   description: 'View real-time analytics and metrics for your application.',
    //   icon: '📊',
    //   route: '/analytics-dashboard',
    //   color: 'secondary'
    // }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1 className="landing-title">Welcome to Ably React Demo</h1>
        <p className="landing-subtitle">
          Explore real-time features and functionality powered by Ably and Laravel Echo
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`feature-card ${feature.color}`}
            onClick={() => handleCardClick(feature.route)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <div className="feature-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="landing-footer">
        <p className="footer-text">
          Built with React, Laravel Echo, and Ably for real-time communication
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
