import type {
  LineCustomizableToolParameters,
  EraserCustomizableToolParameters,
  TextCustomizableToolParameters,
} from './tools.types';

export const DEFAULT_LINE_PARAMS: LineCustomizableToolParameters = {
  strokeColor: '#df4b26',
  brushWidth: 5,
};

export const DEFAULT_ERASER_PARAMS: EraserCustomizableToolParameters = {
  eraserWidth: 100,
};

export const DEFAULT_TEXT_PARAMS: TextCustomizableToolParameters = {
  textContent: '',
};
