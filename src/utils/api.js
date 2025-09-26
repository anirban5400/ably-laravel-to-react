/**
 * API utility functions for the Realtime Feature Playground
 */

/**
 * Parse incoming payload from WebSocket events
 * @param {any} incoming - The incoming payload
 * @returns {any} - Parsed payload
 */
export const parsePayload = (incoming) => {
    let payload = incoming;
    if (typeof payload === 'string') {
        try {
            payload = JSON.parse(payload);
        } catch {
            // Silently ignore parsing errors
        }
    }
    if (payload && typeof payload === 'object' && typeof payload.data === 'string') {
        try {
            payload = JSON.parse(payload.data);
        } catch {
            // Silently ignore parsing errors
        }
    }
    return payload;
};

/**
 * Make API POST request with proper headers
 * @param {string} url - The API endpoint URL
 * @param {object} data - The data to send
 * @returns {Promise<any>} - The response data
 */
export const post = (url, data) => {
    return window.axios.post(url, data, {
        withCredentials: false,
        headers: { 'Accept': 'application/json' }
    }).then(r => r.data);
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
    BROADCAST_DEMO: '/api/broadcast-demo',
    NOTIFY_DEMO: '/api/notify-demo',
    STATUS_DEMO: '/api/status-demo',
    DM_SEND: '/api/dm-send'
};
