import type { EraserElement } from '@/entities/elements';
import Konva from 'konva';

export function createKonvaEraserElement(newEraserElement: EraserElement) {
  const newEraser = new Konva.Line({
    id: newEraserElement.id,
    key: newEraserElement.id,
    points: newEraserElement.points,
    stroke: 'black',
    strokeWidth: newEraserElement.params.eraserWidth,
    tension: 0.5,
    lineCap: 'round',
    lineJoin: 'round',
    globalCompositeOperation: 'destination-out',
  });
  return newEraser;
}
