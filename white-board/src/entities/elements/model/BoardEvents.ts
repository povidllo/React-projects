import type { ElementType } from '@/entities/elements';

export interface ClientToServerEvents {
  'board:sync-request': () => void;
  // 'board:client-send-drawing': (element: ElementType) => void;
  // 'board:client-send-moving': (element: ElementType) => void;
  'board:drawing:client-send-element': (element: ElementType) => void;
  'board:drawing:client-stop-send-element': (element: ElementType) => void;
}

export interface ServerToClientEvents {
  'board:full-sync': (elements: ElementType[]) => void;
  'board:drawing:server-drawing-start': (element: ElementType) => void;
  'board:drawing:server-drawing-update': (element: ElementType) => void;
  'board:drawing:server-drawing-end': (element: ElementType) => void;
}
