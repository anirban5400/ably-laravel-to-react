import { useEffect, useState } from 'react';
import { parsePayload } from '../utils/api';

/**
 * Custom hook for managing chat functionality
 * Handles real-time messaging through the public-demo channel
 */
export const useChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.Echo) return;

    // Listen to public demo channel for messages
    const publicChannel = window.Echo.channel('public-demo');
    
    const handleMessage = (event) => {
      const payload = parsePayload(event);
      const messageText = payload?.message ?? payload?.data?.message ?? JSON.stringify(payload);
      setMessages(prev => [...prev, messageText]);
    };

    publicChannel.listen('.MessageSent', handleMessage);

    // Cleanup
    return () => {
      try {
        if (publicChannel && typeof publicChannel.stopListening === 'function') {
          publicChannel.stopListening('.MessageSent');
        }
        if (window.Echo && typeof window.Echo.leave === 'function') {
          window.Echo.leave('public-demo');
        }
      } catch (error) {
        console.warn('Error cleaning up chat channel:', error?.message ?? 'Unknown error');
      }
    };
  }, []);

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await window.axios.post('/api/broadcast-demo', 
        { message: messageText }, 
        { 
          withCredentials: false, 
          headers: { 'Accept': 'application/json' },
          timeout: 10000 // 10 second timeout
        }
      );
      
      setMessage('');
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Use global error message if available, otherwise provide default
      const userMessage = error.userMessage || 'Failed to send message';
      const enhancedError = new Error(userMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    message,
    setMessage,
    messages,
    sendMessage,
    clearMessages,
    isLoading
  };
};
