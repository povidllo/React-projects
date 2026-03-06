import type {
  ElementType,
  EraserElement,
  LineElement,
  TextElement,
} from '@/models';
import { createKonvaEraserElement } from './konva/createKonvaEraserElement';
import { createKonvaLineElement } from './konva/createKonvaLineElement';

export const createKonvaElementFactory = (element: ElementType) => {
  if (element.type === 'line') {
    return createKonvaLineElement(element as LineElement);
  }

  if (element.type === 'eraser') {
    return createKonvaEraserElement(element as EraserElement);
  }

  throw new Error('Unsupported tool type in createKonvaElement');
};
