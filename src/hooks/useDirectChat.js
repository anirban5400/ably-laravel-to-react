import { useEffect, useRef, useState } from 'react';
import { parsePayload } from '../utils/api';

/**
 * Custom hook for managing direct chat functionality
 * Handles user-to-user messaging through private channels
 */
export const useDirectChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState({
    ownUserId: '1001',
    peerUserId: '1002',
    message: ''
  });

  const dmChannelRef = useRef(null);
  const dmChannelNameRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (dmChannelRef.current) {
        try {
          dmChannelRef.current.stopListening('.DirectMessageSent');
          dmChannelRef.current.stopListening('App\\\\Events\\\\DirectMessageSent');
        } catch (error) {
          console.warn('Error stopping direct message listeners:', error);
        }
      }
      if (dmChannelNameRef.current) {
        try {
          window.Echo.leave(dmChannelNameRef.current);
        } catch (error) {
          console.warn('Error leaving direct message channel:', error);
        }
      }
    };
  }, []);

  const connectToChannel = (ownUserId) => {
    if (!window.Echo) {
      console.warn('Echo not available');
      return;
    }

    // Clean up existing connection
    if (dmChannelRef.current) {
      try {
        dmChannelRef.current.stopListening('.DirectMessageSent');
        dmChannelRef.current.stopListening('App\\\\Events\\\\DirectMessageSent');
      } catch (error) {
        console.warn('Error stopping existing listeners:', error);
      }
    }

    if (dmChannelNameRef.current) {
      try {
        window.Echo.leave(dmChannelNameRef.current);
      } catch (error) {
        console.warn('Error leaving existing channel:', error);
      }
    }

    // Create new channel connection
    const channelName = `chat.user.${ownUserId}`;
    dmChannelNameRef.current = channelName;
    dmChannelRef.current = window.Echo.channel(channelName);

    const handleDirectMessage = (event) => {
      const payload = parsePayload(event);
      if (payload && payload.message && payload.fromUserId && payload.toUserId) {
        const messageText = `From ${payload.fromUserId} → ${payload.toUserId}: ${payload.message}`;
        setMessages(prev => [...prev, messageText]);
      }
    };

    dmChannelRef.current.listen('.DirectMessageSent', handleDirectMessage);
    dmChannelRef.current.listen('App\\\\Events\\\\DirectMessageSent', handleDirectMessage);
    
    setIsConnected(true);
  };

  const sendDirectMessage = async (fromUserId, toUserId, message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await window.axios.post('/api/dm-send', {
        fromUserId,
        toUserId,
        message
      }, {
        withCredentials: false,
        headers: { 'Accept': 'application/json' }
      });

      // Add message to local state for immediate display
      const messageText = `From ${fromUserId} → ${toUserId}: ${message}`;
      setMessages(prev => [...prev, messageText]);
      
      return response.data;
    } catch (error) {
      console.error('Error sending direct message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const disconnect = () => {
    if (dmChannelRef.current) {
      try {
        dmChannelRef.current.stopListening('.DirectMessageSent');
        dmChannelRef.current.stopListening('App\\\\Events\\\\DirectMessageSent');
      } catch (error) {
        console.warn('Error stopping listeners:', error);
      }
    }
    if (dmChannelNameRef.current) {
      try {
        window.Echo.leave(dmChannelNameRef.current);
      } catch (error) {
        console.warn('Error leaving channel:', error);
      }
    }
    setIsConnected(false);
  };

  return {
    messages,
    formData,
    isConnected,
    connectToChannel,
    sendDirectMessage,
    updateFormData,
    clearMessages,
    disconnect,
    isLoading
  };
};
