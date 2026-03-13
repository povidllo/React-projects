import { io, type Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/entities/elements/model/BoardEvents';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface socketContextProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  isError: boolean;
}

const socketContext = createContext<socketContextProps>({
  socket: null,
  isConnected: false,
  isError: false,
});

const SOCKET_URL = 'http://localhost:3000';

export const SocketContextProvider = ({ children }: Props) => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { roomId } = useParams();
  if (!roomId) {
    setIsError(true);
    return;
  }

  useEffect(() => {
    if (!roomId) {
      setIsError(true);
    }
  }, [roomId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
      auth: { roomId },
    });

    socketRef.current.on('connect', () => {
      setIsError(false);
      setIsConnected(true);
      console.log('conected with server ', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      setIsError(false);
      setIsConnected(false);
      console.log('disconnected with server ', reason);
    });

    socketRef.current.on('connect_error', (err) => {
      setIsError(true);
      setIsConnected(false);
      console.error('Error ', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.close();
      socketRef.current = null;
      setIsConnected(false);
      setIsError(false);
    };
  }, []);

  return (
    <socketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected: isConnected,
        isError: isError,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(socketContext);

  if (!context) {
    throw new Error('socket context empty');
  }

  return context;
};
