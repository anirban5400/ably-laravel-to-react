import axios from 'axios';
import Echo from '@ably/laravel-echo';
import * as Ably from 'ably';

// Make axios available globally
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://ably_laravel.test';

// Make Ably available globally
window.Ably = Ably;

// Create Ably client with absolute token endpoint
// Use env for flexibility across dev/prod domains
const client = new Ably.Realtime({
    authUrl: import.meta.env.VITE_ABLY_AUTH_URL || 'http://ably_laravel.test/api/ably/token',
    // Include cookies when your Laravel token endpoint relies on session auth/CSRF
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
            console.log('Connected to Ably');
        }
    });
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */
