import React from 'react';
import { useStatus } from '../hooks/useStatus';

/**
 * LiveStatusTesting Component
 * Handles live status updates and announcements
 */
const LiveStatusTesting = () => {
  const {
    statusUpdates,
    userData,
    announceStatus,
    updateUserData,
    isLoading
  } = useStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      await announceStatus(userData.name, userData.status);
    } catch (error) {
      console.error('Failed to announce status:', error);
    }
  };

  const handleInputChange = (field) => (e) => {
    updateUserData(field, e.target.value);
  };

  const statusOptions = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' }
  ];

  return (
    <div className="card-box">
      <h3 className="card-title">Live status testing</h3>
      <p className="muted">
        Announce your status and watch it update across browsers.
      </p>
      
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Your Name."
          value={userData.name}
          onChange={handleInputChange('name')}
          disabled={isLoading}
        />
        
        <select
          className="input"
          value={userData.status}
          onChange={handleInputChange('status')}
          disabled={isLoading}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <button
          type="submit"
          className="btn primary"
          disabled={isLoading}
        >
          {isLoading ? 'Announcing...' : 'Announce Status.'}
        </button>
      </form>
      
      <div className="status-box">
        <div className="status-title">Status Updates:</div>
        {statusUpdates.length === 0 ? (
          <div className="muted small">No status updates yet.</div>
        ) : (
          statusUpdates.map((update, idx) => (
            <div key={idx} className={`status-item ${update.status === 'online' ? 'ok' : ''}`}>
              <span className="bold">{update.name} is {update.status}.</span>{' '}
              <span className="muted small">({update.received_at})</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveStatusTesting;
