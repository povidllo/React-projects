import type { ElementType } from '@/models';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Html } from 'react-konva-utils';
import { Circle, Line, Text } from 'react-konva';
import { useEffect, useRef } from 'react';

interface DrawElementProps {
  element: ElementType;
  handleOnDragEnd: (
    e: KonvaEventObject<DragEvent>,
    element: ElementType
  ) => void;
  draggable: boolean;
  textEditingId: number | null;
  setTextEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
  setCursor: () => void;
}

export const DrawElement = ({
  element,
  handleOnDragEnd,
  draggable,
  textEditingId,
  setTextEditingId,
  setElements,
  setCursor,
}: DrawElementProps) => {
  switch (element.type) {
    case 'line':
      return element.points.length > 2 ? (
        <Line
          id={String(element.id)}
          x={element.x}
          y={element.y}
          points={element.points}
          stroke={element.params.strokeColor}
          strokeWidth={element.params.brushWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="source-over"
          draggable={draggable}
          onDragEnd={(e) => handleOnDragEnd(e, element)}
        />
      ) : (
        <Circle
          id={String(element.id)}
          x={element.x === 0 ? element.points[0] : element.x}
          y={element.y === 0 ? element.points[1] : element.y}
          radius={element.params.brushWidth / 2}
          fill={element.params.strokeColor}
          draggable={draggable}
          onDragEnd={(e) => handleOnDragEnd(e, element)}
        />
      );

    case 'eraser':
      return element.points.length > 1 ? (
        <Line
          id={String(element.id)}
          x={element.x}
          y={element.y}
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
          x={element.points[0]}
          y={element.points[1]}
          radius={element.params.eraserWidth / 2}
          fill="black"
          globalCompositeOperation="destination-out"
        />
      );

    case 'text':
      if (textEditingId !== element.id) {
        return (
          <Text
            id={String(element.id)}
            x={element.x}
            y={element.y}
            text={element.params.textContent}
            fontSize={element.params.fontSize}
            fontFamily={element.params.fontFamily}
            fill={element.params.fontColor}
            draggable={draggable}
            onDragEnd={(e) => handleOnDragEnd(e, element)}
            onDblClick={() => setTextEditingId(element.id)}
          />
        );
      } else {
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        useEffect(() => {
          setTimeout(() => {
            textareaRef.current?.focus();
          }, 0);
          setCursor();
        }, []);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const newText = e.target.value;
          setElements((prev) =>
            prev.map((el) =>
              el.id === element.id
                ? { ...el, params: { ...el.params, textContent: newText } }
                : el
            )
          );
        };

        const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
          const newText = e.target.value;
          if (newText.length === 0) {
            setElements((prev) => prev.filter((el) => el.id !== element.id));
          }

          if (e.target) setTextEditingId(null);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setTextEditingId(null);
          } else if (e.key === 'Escape') {
            setElements((prev) => prev.filter((el) => el.id !== element.id));
            setTextEditingId(null);
          }
        };

        return (
          <Html>
            <textarea
              ref={textareaRef}
              value={element.params.textContent}
              style={{
                position: 'absolute',
                top: element.y,
                left: element.x,
                fontSize: `${element.params.fontSize}px`,
                fontFamily: element.params.fontFamily,
                color: element.params.fontColor,
                border: '1px solid gray',
                padding: '2px',
                resize: 'none',
                background: 'transparent',
              }}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </Html>
        );
      }

    default:
      return null;
  }
};
