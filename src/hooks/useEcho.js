import { useEffect, useState } from 'react';

export const useEcho = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionState, setConnectionState] = useState('disconnected');

    useEffect(() => {
        if (!window.Echo) return;

        const ablyConn = window.Echo?.connector?.ably?.connection;
        if (!ablyConn) return;

        const handleStateChange = (stateChange) => {
            setConnectionState(stateChange.current);
            setIsConnected(stateChange.current === 'connected');
        };

        ablyConn.on('connected', () => {
            setConnectionState('connected');
            setIsConnected(true);
        });

        ablyConn.on('disconnected', () => {
            setConnectionState('disconnected');
            setIsConnected(false);
        });

        ablyConn.on('failed', (err) => {
            setConnectionState('failed');
            setIsConnected(false);
            console.error('Ably connection failed', err);
        });

        ablyConn.on(handleStateChange);

        return () => {
            ablyConn.off('connected');
            ablyConn.off('disconnected');
            ablyConn.off('failed');
            ablyConn.off(handleStateChange);
        };
    }, []);

    return {
        isConnected,
        connectionState,
        echo: window.Echo
    };
};
