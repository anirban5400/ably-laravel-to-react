import './realtime-setup';

// Example: subscribe to a demo channel
if (window?.Echo) {
    window.Echo.channel('public-demo')
        .listen('MessageSent', (e) => {
            console.log('MessageSent event received:', e);
        });

    // Connection state monitoring and basic UX hooks
    const ablyConn = window.Echo?.connector?.ably?.connection;
    if (ablyConn) {
        ablyConn.on('connected', () => console.log('Connected to Ably'));
        ablyConn.on('disconnected', () => console.log('Disconnected from Ably'));
        ablyConn.on('failed', (err) => console.error('Ably connection failed', err));
    }
}
