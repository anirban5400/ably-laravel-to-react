import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Navigation Component
 * Provides breadcrumb navigation and back button functionality
 */
const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  const isPlaygroundPage = location.pathname === '/realtime-feature-playground';

  const handleGoHome = () => {
    navigate('/');
  };

  if (isHomePage) {
    return null; // No navigation needed on home page
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <button className="nav-home-button" onClick={handleGoHome}>
          🏠 Home
        </button>
        
        <div className="breadcrumbs">
          <span className="breadcrumb-item">Home</span>
          {isPlaygroundPage && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Realtime Feature Playground</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
