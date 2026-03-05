import type {
  LineElement,
  EraserElement,
  ToolType,
  ToolParamsType,
} from '@/models';

export const createElementFactory = (
  type: ToolType,
  params: ToolParamsType,
  x: number,
  y: number
): LineElement | EraserElement => {
  const id = Date.now();
  const points = [x, y];

  if (type === 'line') {
    return {
      id,
      type,
      params: params as typeof params & {
        brushWidth: number;
        strokeColor: string;
      },
      points,
    } as LineElement;
  }

  if (type === 'eraser') {
    return {
      id,
      type,
      params: params as typeof params & { eraserWidth: number },
      points,
    } as EraserElement;
  }

  throw new Error('Unsupported tool type in createElement');
};
