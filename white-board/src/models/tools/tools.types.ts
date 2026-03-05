export type ToolType = 'line' | 'eraser' | 'text';

export interface LineCustomizableToolParameters {
  strokeColor: string;
  brushWidth: number;
}

export interface EraserCustomizableToolParameters {
  eraserWidth: number;
}

export interface TextCustomizableToolParameters {
  textContent: string;
}

export type ToolParamsType =
  | LineCustomizableToolParameters
  | EraserCustomizableToolParameters
  | TextCustomizableToolParameters;
