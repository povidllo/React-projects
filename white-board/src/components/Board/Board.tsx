import {
  DEFAULT_ERASER_PARAMS,
  DEFAULT_LINE_PARAMS,
  type EraserElement,
  type LineElement,
  type TextElement,
  type ToolParamsType,
  type ToolType,
} from '@/models';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { drawElement } from './drawElement';
import type Konva from 'konva';
import { createElementFactory, createKonvaElementFactory } from '@/canvas';

export function Board() {
  const isDrawing = useRef<boolean>(false);
  const layerRef = useRef<Konva.Layer>(null);

  const currentKonvaElementRef = useRef<Konva.Line>(null);
  const currentElementRef = useRef<LineElement | EraserElement | TextElement>(
    null
  );

  const [elements, setElements] = useState<
    (LineElement | EraserElement | TextElement)[]
  >([]);
  const [tool, setTool] = useState<ToolType>('line');
  const [toolParams, setToolParams] =
    useState<ToolParamsType>(DEFAULT_LINE_PARAMS);

  const handleOnMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();
    console.log(`${position?.x} ${position?.y}`);
    if (!position) {
      return;
    }

    if (tool === 'line' || tool === 'eraser') {
      const newElement = createElementFactory(
        tool,
        toolParams,
        position.x,
        position.y
      );
      currentElementRef.current = newElement;
      currentKonvaElementRef.current = createKonvaElementFactory(newElement);
      layerRef.current?.add(currentKonvaElementRef.current);
    }
  };

  const handleOnMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (isDrawing.current && currentKonvaElementRef.current) {
      const stage = e.target.getStage();
      const position = stage?.getPointerPosition();
      console.log(`${position?.x} ${position?.y}`);
      if (!position) {
        return;
      }

      if (tool === 'line' || tool === 'eraser') {
        const konvaLine = currentKonvaElementRef.current as Konva.Line;
        const points = konvaLine.points();
        konvaLine.points([...points, position.x, position.y]);

        if (currentElementRef.current) {
          (
            currentElementRef.current as LineElement | EraserElement
          ).points.push(position.x, position.y);
        }

        layerRef.current?.batchDraw();
      }
    }
  };

  const handleOnMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = false;
    const konvaElement = currentKonvaElementRef.current;
    if (!konvaElement) return;

    if (tool === 'line' || tool === 'eraser') {
      const elementToAdd = currentElementRef.current;
      if (elementToAdd) {
        setElements((prev) => [...prev, elementToAdd]);
      }
      currentKonvaElementRef.current = null;
      currentElementRef.current = null;
    }

    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();

    console.log(`${position?.x} ${position?.y}`);
    console.log(elements);
  };

  return (
    <div>
      <div className="flex">
        <button
          onClick={() => {
            setTool('line');
            setToolParams(DEFAULT_LINE_PARAMS);
          }}
        >
          brush
        </button>
        <button
          onClick={() => {
            setTool('eraser');
            setToolParams(DEFAULT_ERASER_PARAMS);
          }}
        >
          eraser
        </button>
      </div>
      <Stage
        width={1000}
        height={1000}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        style={{ border: '2px solid' }}
      >
        <Layer ref={layerRef}>{elements.map(drawElement)}</Layer>
      </Stage>
    </div>
  );
}
