import type {
  ClientToServerEvents,
  ElementType,
  ServerToClientEvents,
} from '@/entities/elements';
import { useThrottle } from '@/shared/hooks/useThrottle';
import type { Socket } from 'socket.io-client';

export const useDrawingSocketsEmit = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
) => {
  const emitDrawingSendElement = useThrottle((element: ElementType) => {
    if (socket === null) {
      return;
    }
    socket?.emit('board:drawing:client-send-element', element);
  }, 40);

  const emitDrawingStopSendingElement = useThrottle((element: ElementType) => {
    if (socket === null) {
      return;
    }
    socket?.emit('board:drawing:client-stop-send-element', element);
  }, 40);

  return {
    emitDrawingSendElement,
    emitDrawingStopSendingElement,
  };
};
