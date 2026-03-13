import type { KonvaEventObject } from 'konva/lib/Node';
import type Konva from 'konva';

import type { Layer } from 'konva/lib/Layer';
import type { Line, LineConfig } from 'konva/lib/shapes/Line';
import { useRef } from 'react';
import type { Stage } from 'konva/lib/Stage';
import { getRelativePointerPosition } from '@/shared/utils';
import type { ToolParamsType, ToolType } from '@/entities/tools';
import type {
  ElementType,
  EraserElement,
  LineElement,
} from '@/entities/elements';
import { createElementFactory, createKonvaElementFactory } from '../../canvas';
import { Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/entities/elements/model/BoardEvents';
import { useDrawingSocketsEmit } from '../api/useDrawingSocketEmit';

interface UseDrawingProps {
  tool: ToolType;
  toolParams: ToolParamsType | null;
  elements: ElementType[];
  setElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
  layerRef: React.RefObject<Layer | null>;
  stageRef: React.RefObject<Stage | null>;
  currentElementRef: React.RefObject<ElementType | null>;
  currentKonvaElementRef: React.RefObject<Line<LineConfig> | null>;
  setTextEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

export const useDrawing = ({
  tool,
  toolParams,
  setElements,
  layerRef,
  currentElementRef,
  currentKonvaElementRef,
  setTextEditingId,
  socket,
}: UseDrawingProps) => {
  const isDrawing = useRef(false);

  const { emitDrawingSendElement, emitDrawingStopSendingElement } =
    useDrawingSocketsEmit(socket);

  const handleOnMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (stage === null) return;
    const position = getRelativePointerPosition(stage);
    if (!position) return;

    if (tool === 'line' || tool === 'eraser') {
      const newElement = createElementFactory(
        tool,
        toolParams!,
        position.x,
        position.y
      );
      currentElementRef.current = newElement;
      const konvaElement = createKonvaElementFactory(newElement);
      currentKonvaElementRef.current = konvaElement;
      layerRef.current?.add(konvaElement);
    } else if (tool === 'text') {
      const newTextElement = createElementFactory(
        tool,
        toolParams!,
        position.x,
        position.y
      );
      setTextEditingId(newTextElement.id);
      setElements((prev) => [...prev, newTextElement]);
    }
  };

  const handleOnMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current || !currentKonvaElementRef.current) return;
    const stage = e.target.getStage();
    if (stage === null) return;
    const position = getRelativePointerPosition(stage);
    if (!position) return;

    if (tool === 'line' || tool === 'eraser') {
      const konvaLine = currentKonvaElementRef.current as Konva.Line;
      konvaLine.points([...konvaLine.points(), position.x, position.y]);
      if (currentElementRef.current) {
        (currentElementRef.current as LineElement | EraserElement).points.push(
          position.x,
          position.y
        );
      }
      layerRef.current?.batchDraw();
      if (currentElementRef.current) {
        emitDrawingSendElement(currentElementRef.current);
      }
    }
  };

  const handleOnMouseUp = () => {
    isDrawing.current = false;
    const konvaElement = currentKonvaElementRef.current;
    if (!konvaElement) return;

    if (tool === 'line' || tool === 'eraser') {
      const elementToAdd = currentElementRef.current;
      if (elementToAdd) setElements((prev) => [...prev, elementToAdd]);

      konvaElement.remove();
      layerRef.current?.batchDraw();
      if (currentElementRef.current) {
        emitDrawingStopSendingElement(currentElementRef.current);
      }

      currentKonvaElementRef.current = null;
      currentElementRef.current = null;
    }
  };

  // const handleOnDragEnd = (
  //   e: KonvaEventObject<DragEvent>,
  //   element: ElementType
  // ) => {
  //   const newX = e.target.x();
  //   const newY = e.target.y();
  //   const newElement = { ...element, x: newX, y: newY };
  //   setElements((prev) =>
  //     prev.map((el) =>
  //       el.id === element.id ? { ...el, x: newX, y: newY } : el
  //     )
  //   );
  //   e.target.position({ x: newX, y: newY });
  // };

  return {
    handleOnMouseDown,
    handleOnMouseMove,
    handleOnMouseUp,
    // handleOnDragEnd,
  };
};
