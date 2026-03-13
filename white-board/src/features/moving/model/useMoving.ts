import type {
  ClientToServerEvents,
  ElementType,
  ServerToClientEvents,
} from '@/entities/elements';
import type { ToolParamsType, ToolType } from '@/entities/tools';
import type { Layer } from 'konva/lib/Layer';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Line, LineConfig } from 'konva/lib/shapes/Line';
import type { Stage } from 'konva/lib/Stage';
import type { Socket } from 'socket.io-client';
import { useMovingSocketsEmit } from '../api/useMovingSocketEmit';

interface UseDrawingProps {
  // tool: ToolType;
  // toolParams: ToolParamsType | null;
  // elements: ElementType[];
  setElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
  // layerRef: React.RefObject<Layer | null>;
  // stageRef: React.RefObject<Stage | null>;
  // currentElementRef: React.RefObject<ElementType | null>;
  // currentKonvaElementRef: React.RefObject<Line<LineConfig> | null>;
  // setTextEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

export const useMoving = ({
  // tool,
  // toolParams,
  setElements,
  // layerRef,
  // currentElementRef,
  // currentKonvaElementRef,
  // setTextEditingId,
  socket,
}: UseDrawingProps) => {
  const {
    emitMovingStartSendElement,
    emitMovingUpdateSendElement,
    emitMovingEndSendElement,
  } = useMovingSocketsEmit(socket);

  const handleOnDragStart = (
    e: KonvaEventObject<DragEvent>,
    element: ElementType
  ) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const newElement = { ...element, x: newX, y: newY };
    emitMovingStartSendElement(newElement);
  };

  const handleOnDragMove = (
    e: KonvaEventObject<DragEvent>,
    element: ElementType
  ) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const newElement = { ...element, x: newX, y: newY };
    emitMovingUpdateSendElement(newElement);
  };

  const handleOnDragEnd = (
    e: KonvaEventObject<DragEvent>,
    element: ElementType
  ) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const newElement = { ...element, x: newX, y: newY };
    emitMovingEndSendElement(newElement);
  };

  return {
    handleOnDragStart,
    handleOnDragMove,
    handleOnDragEnd,
  };
};
