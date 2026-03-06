import type {
  EraserCustomizableToolParameters,
  LineCustomizableToolParameters,
  TextCustomizableToolParameters,
  ToolType,
} from '../tools/tools.types';

export type Point = number;
export interface Element {
  id: number;
  type: ToolType;
  x: number;
  y: number;
}

// export interface CursorElement extends Element {
//   type: 'cursor';
// }

export interface LineElement extends Element {
  type: 'line';
  points: Point[];
  params: LineCustomizableToolParameters;
}

export interface EraserElement extends Element {
  type: 'eraser';
  points: Point[];
  params: EraserCustomizableToolParameters;
}
export interface TextElement extends Element {
  type: 'text';
  params: TextCustomizableToolParameters;
}

export type ElementType =
  // | CursorElement
  LineElement | EraserElement | TextElement;
