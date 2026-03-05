import type { EraserElement, LineElement, TextElement } from '@/models';
import { Circle, Line } from 'react-konva';

export const drawElement = (
  element: LineElement | EraserElement | TextElement | null
) => {
  if (!element) return null;

  switch (element.type) {
    case 'line':
      return element.points.length > 2 ? (
        <Line
          id={String(element.id)}
          key={element.id}
          points={element.points}
          stroke={element.params.strokeColor}
          strokeWidth={element.params.brushWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={'source-over'}
        />
      ) : (
        <Circle
          id={String(element.id)}
          key={element.id}
          hitStrokeWidth={4}
          x={element.points[0]}
          y={element.points[1]}
          radius={element.params.brushWidth / 2}
          fill={element.params.strokeColor}
        />
      );
    case 'eraser':
      return element.points.length > 1 ? (
        <Line
          id={String(element.id)}
          key={element.id}
          points={element.points}
          stroke="black"
          strokeWidth={element.params.eraserWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="destination-out"
        />
      ) : (
        <Circle
          id={String(element.id)}
          key={element.id}
          fill="black"
          x={element.points[0]}
          y={element.points[1]}
          radius={element.params.eraserWidth / 2}
          globalCompositeOperation="destination-out"
        />
      );
    default:
      return null;
  }
};
