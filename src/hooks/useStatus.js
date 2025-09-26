import { useEffect, useState } from 'react';
import { parsePayload } from '../utils/api';

/**
 * Custom hook for managing live status functionality
 * Handles real-time status updates through the status-demo channel
 */
export const useStatus = () => {
  const [statusUpdates, setStatusUpdates] = useState([
    { name: 'anirban', status: 'online', received_at: '03:21:34' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: 'anirban',
    status: 'online'
  });

  useEffect(() => {
    if (!window.Echo) return;

    // Listen to status channel
    const statusChannel = window.Echo.channel('status-demo');
    
    const handleStatusUpdate = (event) => {
      const payload = parsePayload(event);
      const statusUpdate = {
        name: payload?.user || 'Guest',
        status: payload?.status || 'online',
        received_at: new Date().toLocaleTimeString()
      };
      
      setStatusUpdates(prev => [...prev, statusUpdate]);
    };

    statusChannel.listen('.DemoStatusChanged', handleStatusUpdate);

    // Cleanup
    return () => {
      try {
        if (statusChannel && typeof statusChannel.stopListening === 'function') {
          statusChannel.stopListening('.DemoStatusChanged');
        }
        if (window.Echo && typeof window.Echo.leave === 'function') {
          window.Echo.leave('status-demo');
        }
      } catch (error) {
        console.warn('Error cleaning up status channel:', error);
      }
    };
  }, []);

  const announceStatus = async (userName, userStatus) => {
    setIsLoading(true);
    try {
      const response = await window.axios.post('/api/status-demo', {
        user: userName,
        status: userStatus
      }, {
        withCredentials: false,
        headers: { 'Accept': 'application/json' },
        timeout: 10000 // 10 second timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error announcing status:', error);
      
      // Use global error message if available, otherwise provide default
      const userMessage = error.userMessage || 'Failed to announce status';
      const enhancedError = new Error(userMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const clearStatusUpdates = () => {
    setStatusUpdates([]);
  };

  return {
    statusUpdates,
    userData,
    announceStatus,
    updateUserData,
    clearStatusUpdates,
    isLoading
  };
};
