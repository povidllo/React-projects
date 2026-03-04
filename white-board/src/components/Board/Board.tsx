import type {
  EraserElement,
  LineElement,
  Point,
  TextElement,
  Tool,
} from '@/models';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';
import { drawElement } from './drawElement';

export function Board() {
  const canvasRef = useRef(null);
  const isDrawing = useRef<boolean>(false);
  const [elements, setElements] = useState<
    (LineElement | EraserElement | TextElement)[]
  >([]);

  const [tool, setTool] = useState<Tool>('line');

  const handleOnMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();
    console.log(`${position?.x} ${position?.y}`);
    if (!position) {
      return;
    }
    switch (tool) {
      case 'line':
        setElements((prev) => {
          const newLine: LineElement = {
            id: Date.now(),
            type: 'line',
            brushWidth: 5,
            points: [position.x, position.y],
            strokeColor: '#df4b26',
          };
          return [...prev, newLine];
        });
        break;
      case 'eraser':
        setElements((prev) => {
          const newLine: EraserElement = {
            id: Date.now(),
            type: 'eraser',
            eraserWidth: 5,
            points: [position.x, position.y],
          };
          return [...prev, newLine];
        });
        break;
      case 'text':
    }
  };

  const handleOnMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (isDrawing.current) {
      const stage = e.target.getStage();
      const position = stage?.getPointerPosition();
      console.log(`${position?.x} ${position?.y}`);
      if (!position) {
        return;
      }
      switch (tool) {
        case 'line':
          setElements((prev) => {
            const last = prev[prev.length - 1] as LineElement;

            const updatedLast: LineElement = {
              ...last,
              points: [...last.points, position.x, position.y],
            };

            return [...prev.slice(0, -1), updatedLast];
          });
          break;
        case 'eraser':
          setElements((prev) => {
            const last = prev[prev.length - 1] as EraserElement;

            const updatedLast: EraserElement = {
              ...last,
              points: [...last.points, position.x, position.y],
            };

            return [...prev.slice(0, -1), updatedLast];
          });
          break;
        case 'text':
      }
    }
  };

  const handleOnMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = false;
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();

    console.log(`${position?.x} ${position?.y}`);
    console.log(elements);
  };

  return (
    <div>
      <button onClick={() => setTool('eraser')}>изменить</button>
      <Stage
        ref={canvasRef}
        width={1000}
        height={1000}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        style={{ border: '2px solid' }}
      >
        <Layer>{elements.map(drawElement)}</Layer>
      </Stage>
    </div>
  );
}
