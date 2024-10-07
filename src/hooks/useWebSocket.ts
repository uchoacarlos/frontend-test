import { useEffect, useRef } from 'react';

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

const useWebSocket = (
  url: string,
  onMessage: (event: MessageEvent) => void,
  options?: UseWebSocketOptions
) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    socket.current = new WebSocket(url);

    socket.current.onmessage = onMessage;

    if (options?.onOpen) {
      socket.current.onopen = options.onOpen;
    }

    if (options?.onClose) {
      socket.current.onclose = options.onClose;
    }

    if (options?.onError) {
      socket.current.onerror = options.onError;
    }

    return () => {
      socket.current?.close();
    };
  }, [url, onMessage, options]);

  return socket;
};

export default useWebSocket;
