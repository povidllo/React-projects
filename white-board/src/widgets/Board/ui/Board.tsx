import { useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import type Konva from 'konva';
import { DrawElement, type ElementType } from '@/entities/elements';
import {
  DEFAULT_ERASER_PARAMS,
  DEFAULT_LINE_PARAMS,
  DEFAULT_TEXT_PARAMS,
  type ToolParamsType,
  type ToolType,
} from '@/entities/tools';
import { useDrawing } from '@/features/drawing';
import { useZoom } from '@/features/zoom';

export function Board() {
  const layerRef = useRef<Konva.Layer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const currentKonvaElementRef = useRef<Konva.Line>(null);
  const currentElementRef = useRef<ElementType>(null);

  const [elements, setElements] = useState<ElementType[]>([]);
  const [tool, setTool] = useState<ToolType>('cursor');
  const [toolParams, setToolParams] = useState<ToolParamsType | null>(null);

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

  const setCursor = () => {
    setTool('cursor');
    console.log('cursor');
    setToolParams(null);
  };
  const setHand = () => {
    setTool('hand');
    console.log('hand');

    setToolParams(null);
  };
  const setLine = () => {
    setTool('line');
    console.log('line');

    setToolParams(DEFAULT_LINE_PARAMS);
  };
  const setEraser = () => {
    setTool('eraser');
    console.log('eraser');

    setToolParams(DEFAULT_ERASER_PARAMS);
  };
  const setText = () => {
    setTool('text');
    console.log('text');

    setToolParams(DEFAULT_TEXT_PARAMS);
  };

  return (
    <div>
      <div className="flex">
        <button onClick={setCursor}>cursor</button>
        <button onClick={setHand}>hand</button>
        <button onClick={setLine}>brush</button>
        <button onClick={setEraser}>eraser</button>
        <button onClick={setText}>text</button>
      </div>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        onWheel={handleWheel}
        style={{ border: '2px solid' }}
        draggable={tool === 'hand'}
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
              setCursor={setCursor}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
