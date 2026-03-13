import type {
  ClientToServerEvents,
  ElementType,
  ServerToClientEvents,
} from '@/entities/elements';
import { useThrottle } from '@/shared/hooks/useThrottle';
import type { Socket } from 'socket.io-client';

export const useMovingSocketsEmit = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
) => {
  const emitMovingStartSendElement = useThrottle((element: ElementType) => {
    if (socket === null) {
      return;
    }

    socket?.emit('board:moving:client-start-send-element', element);
  }, 40);

  const emitMovingUpdateSendElement = useThrottle((element: ElementType) => {
    if (socket === null) {
      return;
    }

    socket?.emit('board:moving:client-update-send-element', {
      id: element.id,
      x: element.x,
      y: element.y,
    });
  }, 40);

  const emitMovingEndSendElement = useThrottle((element: ElementType) => {
    if (socket === null) {
      return;
    }

    socket?.emit('board:moving:client-end-send-element', element);
  }, 40);

  return {
    emitMovingStartSendElement,
    emitMovingUpdateSendElement,
    emitMovingEndSendElement,
  };
};
