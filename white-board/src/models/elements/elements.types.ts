import type { Tool } from '../tools/tools.types';

export type Point = number;
export interface Element {
  id: number;
  type: Tool;
}

export interface LineElement extends Element {
  type: 'line';
  points: Point[];
  strokeColor: string;
  brushWidth: number;
}

export interface EraserElement extends Element {
  type: 'eraser';
  points: Point[];
  eraserWidth: number;
}
export interface TextElement extends Element {
  type: 'text';
  textContent: string;
  // eraserWidth: number;
}
