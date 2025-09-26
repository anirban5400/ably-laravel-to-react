import axios from 'axios';
import Echo from '@ably/laravel-echo';
import * as Ably from 'ably';

/**
 * Lazy Realtime Setup
 * Only initializes Ably connection when needed
 */
let isInitialized = false;
let initializationPromise = null;

/**
 * Initialize realtime connection (Ably + Echo)
 * This function is idempotent - safe to call multiple times
 */
export const initializeRealtime = async () => {
    // If already initialized, return immediately
    if (isInitialized) {
        return Promise.resolve();
    }

    // If initialization is in progress, return the existing promise
    if (initializationPromise) {
        return initializationPromise;
    }

    // Start initialization
    initializationPromise = (async () => {
        try {
            console.log('🚀 Initializing realtime connection...');

            // Make axios available globally (always needed for API calls)
            if (!window.axios) {
                window.axios = axios;
                window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
                window.axios.defaults.withCredentials = true;
                window.axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://ably_laravel.test';
                window.axios.defaults.timeout = 10000; // 10 second default timeout
                
                // Add response interceptor for better error handling
                window.axios.interceptors.response.use(
                    (response) => response,
                    (error) => {
                        // Enhance error messages globally
                        if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
                            error.userMessage = 'Request timeout - please check your connection and try again';
                        } else if (error.message?.includes('Network Error')) {
                            error.userMessage = 'Network error - please check your internet connection';
                        } else if (error.response?.status === 500) {
                            error.userMessage = 'Server error - please try again later';
                        } else if (error.response?.status === 401 || error.response?.status === 403) {
                            error.userMessage = 'Authentication failed - please refresh the page';
                        }
                        return Promise.reject(error);
                    }
                );
            }

            // Make Ably available globally
            window.Ably = Ably;

            // Create Ably client with timeout and error handling
            const client = new Ably.Realtime({
                authUrl: import.meta.env.VITE_ABLY_AUTH_URL || 'http://ably_laravel.test/api/ably/token',
                transportParams: { 
                    xhrWithCredentials: true,
                    timeout: 10000, // 10 second timeout
                    requestTimeout: 15000 // 15 second request timeout
                },
                // Connection timeout settings
                connectionStateTtl: 30000, // 30 seconds
                disconnectedRetryTimeout: 5000, // 5 seconds
                suspendedRetryTimeout: 30000, // 30 seconds
                // Error handling
                recover: true,
                // Log level for debugging
                logLevel: import.meta.env.DEV ? 'debug' : 'warn'
            });

            // Initialize Echo with Ably
            window.Echo = new Echo({
                broadcaster: 'ably',
                client,
            });

            // Connection state monitoring with detailed error handling
            if (window.Echo?.connector?.ably?.connection) {
                window.Echo.connector.ably.connection.on((stateChange) => {
                    const { current, reason } = stateChange;
                    
                    if (current === 'connected') {
                        console.log('✅ Connected to Ably');
                    } else if (current === 'disconnected') {
                        console.log('❌ Disconnected from Ably');
                    } else if (current === 'failed') {
                        console.error('💥 Ably connection failed:', reason);
                        
                        // Handle specific error types
                        if (reason?.code === 80000) {
                            console.error('🔌 Network timeout - please check your internet connection');
                        } else if (reason?.code === 40000) {
                            console.error('🔑 Authentication failed - please refresh the page');
                        } else if (reason?.code === 50000) {
                            console.error('🚫 Server error - please try again later');
                        }
                    } else if (current === 'suspended') {
                        console.warn('⏸️ Connection suspended - attempting to reconnect...');
                    } else if (current === 'connecting') {
                        console.log('🔄 Connecting to Ably...');
                    }
                });
            }

            isInitialized = true;
            console.log('🎉 Realtime setup completed successfully');
        } catch (error) {
            console.error('💥 Failed to initialize realtime connection:', error);
            
            // Provide user-friendly error messages
            let userMessage = 'Failed to connect to realtime services';
            
            if (error.message?.includes('timeout')) {
                userMessage = 'Connection timeout - please check your internet connection and try again';
            } else if (error.message?.includes('Network Error')) {
                userMessage = 'Network error - please check your internet connection';
            } else if (error.message?.includes('abort')) {
                userMessage = 'Connection was interrupted - please try again';
            } else if (error.message?.includes('401') || error.message?.includes('403')) {
                userMessage = 'Authentication failed - please refresh the page';
            } else if (error.message?.includes('500')) {
                userMessage = 'Server error - please try again later';
            }
            
            // Create enhanced error object
            const enhancedError = new Error(userMessage);
            enhancedError.originalError = error;
            enhancedError.code = error.code;
            enhancedError.isTimeout = error.message?.includes('timeout') || error.message?.includes('abort');
            
            isInitialized = false;
            initializationPromise = null;
            throw enhancedError;
        }
    })();

    return initializationPromise;
};

/**
 * Check if realtime connection is initialized
 */
export const isRealtimeInitialized = () => isInitialized;

/**
 * Get the Echo instance (will initialize if not already done)
 */
export const getEcho = async () => {
    await initializeRealtime();
    return window.Echo;
};

/**
 * Get the Ably client (will initialize if not already done)
 */
export const getAblyClient = async () => {
    await initializeRealtime();
    return window.Ably;
};

/**
 * Disconnect and cleanup realtime connection
 */
export const disconnectRealtime = () => {
    if (window.Echo) {
        try {
            // Leave all channels
            window.Echo.disconnect();
            console.log('🔌 Disconnected from Ably');
        } catch (error) {
            console.warn('Error disconnecting from Ably:', error);
        }
    }
    
    // Reset state
    isInitialized = false;
    initializationPromise = null;
    
    // Clear global references
    window.Echo = null;
    window.Ably = null;
};
