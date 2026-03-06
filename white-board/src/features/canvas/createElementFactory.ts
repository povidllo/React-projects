import type {
  ElementType,
  EraserElement,
  LineElement,
  TextElement,
} from '@/entities/elements';
import type {
  EraserCustomizableToolParameters,
  LineCustomizableToolParameters,
  TextCustomizableToolParameters,
  ToolParamsType,
  ToolType,
} from '@/entities/tools';

export const createElementFactory = (
  type: ToolType,
  params: ToolParamsType,
  x: number,
  y: number
): ElementType => {
  const id = Date.now();
  const points = [x, y];

  if (type === 'line') {
    return {
      id,
      type,
      params: params as LineCustomizableToolParameters,
      points,
      x: 0,
      y: 0,
    } as LineElement;
  }

  if (type === 'eraser') {
    return {
      id,
      type,
      params: params as EraserCustomizableToolParameters,
      points,
      x: 0,
      y: 0,
    } as EraserElement;
  }

  if (type === 'text') {
    return {
      id,
      type,
      params: params as TextCustomizableToolParameters,
      x: x,
      y: y,
    } as TextElement;
  }

  throw new Error('Unsupported tool type in createElement');
};
