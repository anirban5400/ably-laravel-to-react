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
        publicChannel.stopListening('.MessageSent');
        window.Echo.leave('public-demo');
      } catch (error) {
        console.warn('Error cleaning up chat channel:', error);
      }
    };
  }, []);

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await window.axios.post('/api/broadcast-demo', 
        { message: messageText }, 
        { withCredentials: false, headers: { 'Accept': 'application/json' } }
      );
      
      setMessage('');
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
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
