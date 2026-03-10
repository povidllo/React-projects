import { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import type Konva from 'konva';
import {
  DrawElement,
  type ElementType,
  type TextElement,
} from '@/entities/elements';
import { useDrawing } from '@/features/drawing';
import { useZoom } from '@/features/zoom';
import { useToolContext } from '..';

export function Board() {
  const layerRef = useRef<Konva.Layer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const textToolbarRef = useRef<HTMLDivElement>(null);

  const currentKonvaElementRef = useRef<Konva.Line>(null);
  const currentElementRef = useRef<ElementType>(null);

  const [elements, setElements] = useState<ElementType[]>([]);

  const { tool, setTool, toolParams, setToolParams } = useToolContext();

  const [textEditingId, setTextEditingId] = useState<number | null>(null);

  const {
    handleOnMouseDown,
    handleOnMouseMove,
    handleOnMouseUp,
    handleOnDragEnd,
  } = useDrawing({
    tool,
    toolParams,
    elements,
    setElements,
    layerRef,
    currentElementRef,
    currentKonvaElementRef,
    setTextEditingId,
    stageRef,
  });

  const { handleWheel } = useZoom({ stageRef });

  const selectedTextElement = elements.find(
    (el) => el.id === textEditingId && el.type === 'text'
  ) as TextElement;

  useEffect(() => {
    console.log(elements);
  }, [elements]);

  return (
    <div>
      {selectedTextElement && (
        <div
          ref={textToolbarRef}
          className="absolute top-2 border bg-white p-2 shadow z-50"
          onMouseDown={(e) => {
            e.preventDefault();
            // e.stopPropagation();
          }}
        >
          <button>Жирный</button>
          <button>Курсив</button>
          <input onMouseDown={(e) => e.preventDefault()} type="color" />
        </div>
      )}
      <Stage
        id="stage"
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        onWheel={handleWheel}
        style={{ border: '2px solid' }}
        draggable={tool === 'hand'}
        className={
          ['line', 'eraser'].includes(tool)
            ? 'cursor-[var(--custom-cursor)]'
            : 'cursor-crosshairs'
        }
      >
        <Layer ref={layerRef}>
          {elements.map((elem) => (
            <DrawElement
              key={elem.id}
              element={elem}
              handleOnDragEnd={handleOnDragEnd}
              draggable={tool === 'cursor' ? true : false}
              setTextEditingId={setTextEditingId}
              textEditingId={textEditingId}
              setElements={setElements}
              setCursor={() => {
                setTool('cursor');
                setToolParams(null);
              }}
              textToolbarRef={textToolbarRef}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
