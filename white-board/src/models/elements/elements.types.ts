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
}

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
