import type { ElementType } from '@/entities/elements';

interface movingElementType {
  id: string;
  x: number;
  y: number;
}

export interface ClientToServerEvents {
  'board:sync-request': () => void;
  'board:drawing:client-send-element': (element: ElementType) => void;
  'board:drawing:client-stop-send-element': (element: ElementType) => void;

  'board:moving:client-start-send-element': (
    movingElement: ElementType
  ) => void;
  'board:moving:client-update-send-element': (
    movingElement: movingElementType
  ) => void;
  'board:moving:client-end-send-element': (
    movingElement: movingElementType
  ) => void;
}

export interface ServerToClientEvents {
  'board:full-sync': (elements: ElementType[]) => void;
  'board:drawing:server-drawing-start': (element: ElementType) => void;
  'board:drawing:server-drawing-update': (element: ElementType) => void;
  'board:drawing:server-drawing-end': (element: ElementType) => void;

  'board:moving:server-moving-start': (movingElement: ElementType) => void;
  'board:moving:server-moving-update': (
    movingElement: movingElementType
  ) => void;
  'board:moving:server-moving-end': (movingElement: ElementType) => void;
}
