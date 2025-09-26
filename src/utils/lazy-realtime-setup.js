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
            }

            // Make Ably available globally
            window.Ably = Ably;

            // Create Ably client with absolute token endpoint
            const client = new Ably.Realtime({
                authUrl: import.meta.env.VITE_ABLY_AUTH_URL || 'http://ably_laravel.test/api/ably/token',
                transportParams: { xhrWithCredentials: true }
            });

            // Initialize Echo with Ably
            window.Echo = new Echo({
                broadcaster: 'ably',
                client,
            });

            // Connection state monitoring
            if (window.Echo?.connector?.ably?.connection) {
                window.Echo.connector.ably.connection.on((stateChange) => {
                    if (stateChange.current === 'connected') {
                        console.log('✅ Connected to Ably');
                    } else if (stateChange.current === 'disconnected') {
                        console.log('❌ Disconnected from Ably');
                    } else if (stateChange.current === 'failed') {
                        console.error('💥 Ably connection failed');
                    }
                });
            }

            isInitialized = true;
            console.log('🎉 Realtime setup completed successfully');
        } catch (error) {
            console.error('💥 Failed to initialize realtime connection:', error);
            isInitialized = false;
            initializationPromise = null;
            throw error;
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
