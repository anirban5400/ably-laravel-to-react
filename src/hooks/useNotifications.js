import { useEffect, useState } from 'react';
import { parsePayload } from '../utils/api';

/**
 * Custom hook for managing notification functionality
 * Handles real-time notifications through the notify-demo channel
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Demo Notification',
    message: 'Hello from notify-demo',
    type: 'info'
  });

  useEffect(() => {
    if (!window.Echo) return;

    // Listen to notification channel
    const notificationChannel = window.Echo.channel('notify-demo');
    
    const handleNotification = (event) => {
      const payload = parsePayload(event);
      const notification = {
        type: payload?.type || 'info',
        title: payload?.title || 'Demo Notification',
        message: payload?.message || '',
        received_at: new Date().toLocaleTimeString()
      };
      
      setNotifications(prev => [...prev, notification]);
    };

    notificationChannel.listen('.DemoNotificationSent', handleNotification);

    // Cleanup
    return () => {
      try {
        notificationChannel.stopListening('.DemoNotificationSent');
        window.Echo.leave('notify-demo');
      } catch (error) {
        console.warn('Error cleaning up notification channel:', error);
      }
    };
  }, []);

  const sendNotification = async (notificationData) => {
    setIsLoading(true);
    try {
      const response = await window.axios.post('/api/notify-demo', notificationData, {
        withCredentials: false,
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    notifications,
    formData,
    sendNotification,
    clearNotifications,
    updateFormData,
    isLoading
  };
};
