import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

/**
 * NotificationTest Component
 * Handles notification sending and receiving functionality
 */
const NotificationTest = () => {
  const {
    notifications,
    formData,
    sendNotification,
    updateFormData,
    isLoading
  } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      await sendNotification(formData);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleInputChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  const notificationTypes = [
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  return (
    <div className="card-box">
      <h3 className="card-title">Notification test</h3>
      <p className="muted">
        Send a notification and see it arrive instantly.
      </p>
      
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Title."
          value={formData.title}
          onChange={handleInputChange('title')}
          disabled={isLoading}
        />
        
        <input
          className="input"
          placeholder="Message."
          value={formData.message}
          onChange={handleInputChange('message')}
          disabled={isLoading}
        />
        
        <select
          className="input"
          value={formData.type}
          onChange={handleInputChange('type')}
          disabled={isLoading}
        >
          {notificationTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        
        <button
          type="submit"
          className="btn primary"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send notification.'}
        </button>
      </form>
      
      <div className="notifications">
        <div className="notifications-title">Notifications:</div>
        {notifications.length === 0 ? (
          <div className="muted small">No notifications yet.</div>
        ) : (
          notifications.map((notification, idx) => (
            <div key={idx} className="note">
              [{notification.type.toUpperCase()}] {notification.title}: {notification.message} ({notification.received_at})
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationTest;
