import React from 'react';

/**
 * Card Component
 * Reusable card wrapper for consistent styling
 */
const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`card-box ${className}`}>
            <h3 className="card-title">{title}</h3>
            {children}
        </div>
    );
};

export default Card;
