import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import type {
  ClientToServerEvents,
  ElementType,
  ServerToClientEvents,
} from '@/entities/elements';
import {
  createElementFactory,
  createKonvaElementFactory,
} from '@/features/canvas';
import type { Socket } from 'socket.io-client';

export function useBoardSocket(
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
  setElements: React.Dispatch<React.SetStateAction<ElementType[]>>,
  layerRef: React.RefObject<Konva.Layer | null>
) {
  const konvaServerElementsRef = useRef<Map<string, Konva.Line>>(new Map());

  useEffect(() => {
    if (!socket) return;
    socket.emit('board:sync-request');

    const fullSync = (data: ElementType[]) => setElements([...data]);
    socket.on('board:full-sync', fullSync);

    socket.on('board:drawing:server-drawing-start', (newElem) => {
      if (newElem.type === 'line' || newElem.type === 'eraser') {
        const el = createElementFactory(
          newElem.type,
          newElem.params!,
          newElem.x,
          newElem.y,
          newElem.id,
          newElem.points
        );
        const k = createKonvaElementFactory(el);
        konvaServerElementsRef.current.set(newElem.id, k);
        layerRef.current?.add(k);
      }
    });
    socket.on('board:drawing:server-drawing-update', (newElem) => {
      if (newElem.type === 'line' || newElem.type === 'eraser') {
        const k = konvaServerElementsRef.current.get(newElem.id) as Konva.Line;
        if (!k) return;
        k.points([...newElem.points]);
        layerRef.current?.batchDraw();
      }
    });

    socket.on('board:drawing:server-drawing-end', (newElem) => {
      if (newElem.type === 'line' || newElem.type === 'eraser') {
        if (konvaServerElementsRef.current.has(newElem.id)) {
          const k = konvaServerElementsRef.current.get(newElem.id);
          if (k) {
            k.destroy();
          }
          setElements((prev) => [...prev, newElem]);
          konvaServerElementsRef.current.delete(newElem.id);
        }
      }
    });

    socket.on('board:moving:server-moving-start', (data) => {
      if (data.type === 'line' || data.type === 'eraser') {
        const el = createElementFactory(
          data.type,
          data.params!,
          data.x,
          data.y,
          data.id,
          data.points
        );
        console.log(data.x, data.y);
        setElements((prev) => prev.filter((elem) => elem.id !== data.id));
        const k = createKonvaElementFactory(el);
        konvaServerElementsRef.current.set(data.id, k);
        layerRef.current?.add(k);
      }
    });
    socket.on('board:moving:server-moving-update', (data) => {
      const k = konvaServerElementsRef.current.get(data.id) as Konva.Line;
      if (!k) return;
      k.x(data.x);
      k.y(data.y);
      layerRef.current?.batchDraw();
    });
    socket.on('board:moving:server-moving-end', (data) => {
      const k = konvaServerElementsRef.current.get(data.id);
      if (k) {
        k.destroy();
      }
      konvaServerElementsRef.current.delete(data.id);
      setElements((prev) => [...prev, data]);
    });

    return () => {
      socket.off('board:full-sync', fullSync);
      socket.off('board:drawing:server-drawing-start');
      socket.off('board:drawing:server-drawing-update');
      socket.off('board:drawing:server-drawing-end');

      socket.off('board:moving:server-moving-start');
      socket.off('board:moving:server-moving-update');
      socket.off('board:moving:server-moving-end');
    };
  }, [socket, setElements, layerRef]);
}
