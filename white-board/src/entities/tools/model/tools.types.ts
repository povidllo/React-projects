export type ToolType = 'cursor' | 'hand' | 'line' | 'eraser' | 'text';

export interface LineCustomizableToolParameters {
  strokeColor: string;
  brushWidth: number;
}

export interface EraserCustomizableToolParameters {
  eraserWidth: number;
}

export interface TextCustomizableToolParameters {
  textContent: string;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
}

export type ToolParamsType =
  | LineCustomizableToolParameters
  | EraserCustomizableToolParameters
  | TextCustomizableToolParameters;
