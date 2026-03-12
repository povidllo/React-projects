import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import type { ElementType } from '@/entities/elements';
import {
  createElementFactory,
  createKonvaElementFactory,
} from '@/features/canvas';
import type { Socket } from 'socket.io-client';

export function useBoardSocket(
  socket: Socket | null,
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
      const k = konvaServerElementsRef.current.get(newElem.id) as Konva.Line;
      if (!k) return;
      k.points([...newElem.points]);
      layerRef.current?.batchDraw();
    });
    socket.on('board:drawing:server-drawing-end', (newElem) => {
      if (konvaServerElementsRef.current.has(newElem.id)) {
        setElements((prev) => [...prev, newElem]);
        konvaServerElementsRef.current.delete(newElem.id);
      }
    });

    return () => {
      socket.off('board:full-sync', fullSync);
      socket.off('board:drawing:server-drawing-start');
      socket.off('board:drawing:server-drawing-update');
      socket.off('board:drawing:server-drawing-end');
    };
  }, [socket, setElements, layerRef]);
}
