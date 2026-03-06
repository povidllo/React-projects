import {
  DEFAULT_ERASER_PARAMS,
  DEFAULT_LINE_PARAMS,
  DEFAULT_TEXT_PARAMS,
  type ElementType,
  type ToolParamsType,
  type ToolType,
} from '@/models';
import { useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import type Konva from 'konva';
import { DrawElement } from './DrawElement';
import { useBoardHandlers } from '@/hooks';

export function Board() {
  const layerRef = useRef<Konva.Layer>(null);

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
  } = useBoardHandlers({
    tool,
    toolParams,
    elements,
    setElements,
    layerRef,
    currentElementRef,
    currentKonvaElementRef,
    setTextEditingId,
  });

  const setCursor = () => {
    setTool('cursor');
    setToolParams(null);
  };
  const setLine = () => {
    setTool('line');
    setToolParams(DEFAULT_LINE_PARAMS);
  };
  const setEraser = () => {
    setTool('eraser');
    setToolParams(DEFAULT_ERASER_PARAMS);
  };
  const setText = () => {
    setTool('text');
    setToolParams(DEFAULT_TEXT_PARAMS);
  };

  return (
    <div>
      <div className="flex">
        <button onClick={setCursor}>cursor</button>
        <button onClick={setLine}>brush</button>
        <button onClick={setEraser}>eraser</button>
        <button onClick={setText}>text</button>
      </div>
      <Stage
        width={1000}
        height={1000}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        style={{ border: '2px solid' }}
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
