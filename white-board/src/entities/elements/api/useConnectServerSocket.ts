import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/entities/elements/model/BoardEvents';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ElementType } from '../model/elements.types';
import {
  createElementFactory,
  createKonvaElementFactory,
} from '@/features/canvas';
import type Konva from 'konva';

const SOCKET_URL = 'http://localhost:3000';

interface useConnectServerSocketProps {
  setElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
  layerRef: React.RefObject<Konva.Layer | null>;
}

export const useConnectServerSocket = ({
  layerRef,
  setElements,
}: useConnectServerSocketProps) => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  // const konvaServerElementsRef = useRef<Map<string, Konva.Line>>(new Map());

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

  // const socket = socketRef.current;
  // useEffect(() => {
  //   if (!socket) return;

  //   console.log('socket ready');

  //   socket.emit('board:sync-request');

  //   const handler = (data: ElementType[]) => {
  //     setElements([...data]);
  //   };

  //   socket.on('board:full-sync', handler);

  //   socket.on('board:drawing:server-drawing-start', (newElem) => {
  //     if (newElem.type === 'line' || newElem.type === 'eraser') {
  //       const newElement = createElementFactory(
  //         newElem.type,
  //         newElem.params!,
  //         newElem.x,
  //         newElem.y,
  //         newElem.id,
  //         newElem.points
  //       );
  //       console.log('start\n', newElement, newElem);
  //       const konvaElement = createKonvaElementFactory(newElement);
  //       konvaServerElementsRef.current.set(newElem.id, konvaElement);
  //       console.log(konvaServerElementsRef.current.get(newElement.id));
  //       layerRef.current?.add(konvaElement);
  //     }
  //   });

  //   socket.on('board:drawing:server-drawing-update', (newElem) => {
  //     if (newElem.type === 'line' || newElem.type === 'eraser') {
  //       const konvaLine = konvaServerElementsRef.current.get(
  //         newElem.id
  //       ) as Konva.Line;
  //       if (!konvaLine) return;
  //       konvaLine.points([...newElem.points]);

  //       console.log('update');

  //       layerRef.current?.batchDraw();
  //     }
  //   });

  //   socket.on('board:drawing:server-drawing-end', (newElem) => {
  //     if (konvaServerElementsRef.current.has(newElem.id)) {
  //       setElements((prev) => [...prev, newElem!]);
  //       console.log('end');

  //       konvaServerElementsRef.current.delete(newElem.id);
  //     }
  //   });

  //   return () => {
  //     socket.off('board:full-sync', handler);
  //     socket.off('board:drawing:server-drawing-start');
  //     socket.off('board:drawing:server-drawing-update');
  //   };
  // }, [socket, isConnected]);

  return { socket: socketRef.current, isConnected };
};
