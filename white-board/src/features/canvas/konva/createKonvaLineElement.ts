import type { LineElement } from '@/entities/elements';
import Konva from 'konva';

export function createKonvaLineElement(newLineElement: LineElement) {
  const newLine = new Konva.Line({
    id: String(newLineElement.id),
    key: newLineElement.id,
    points: newLineElement.points,
    stroke: newLineElement.params.strokeColor,
    strokeWidth: newLineElement.params.brushWidth,
    tension: 0.5,
    lineCap: 'round',
    lineJoin: 'round',
    globalCompositeOperation: 'source-over',
  });
  return newLine;
}
