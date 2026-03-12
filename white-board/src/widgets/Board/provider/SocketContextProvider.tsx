import { io, type Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../../entities/elements/model/BoardEvents';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface Props {
  children: ReactNode;
}

interface socketContextProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
}

const socketContext = createContext<socketContextProps>({
  socket: null,
  isConnected: false,
});

const SOCKET_URL = 'http://localhost:3000';

export const SocketContextProvider = ({ children }: Props) => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const [isConnected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      console.log('conected with server ', socketRef.current?.id);
      setConnected(true);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('disconnected with server ', reason);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Error ', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.close();
      socketRef.current = null;
      setConnected(false);
    };
  }, []);
  const socket = socketRef.current;

  return (
    <socketContext.Provider
      value={{ socket: socket, isConnected: isConnected }}
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
