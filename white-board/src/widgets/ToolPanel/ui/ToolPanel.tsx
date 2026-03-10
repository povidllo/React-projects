import {
  DEFAULT_ERASER_PARAMS,
  DEFAULT_LINE_PARAMS,
  DEFAULT_TEXT_PARAMS,
  ToolButton,
  type EraserCustomizableToolParameters,
  type LineCustomizableToolParameters,
  type ToolType,
} from '@/entities/tools';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useToolContext } from '@/widgets/Board';
import {
  Brush,
  Eraser,
  MousePointer2,
  Pointer,
  TypeOutline,
} from 'lucide-react';
import { useEffect } from 'react';

export function ToolPanel() {
  const { tool, setTool, toolParams, setToolParams } = useToolContext();

  const handleSetToolClick = (tool: ToolType) => {
    setTool((prev) => {
      if (prev !== tool) {
        switch (tool) {
          case 'cursor':
          case 'hand':
            setToolParams(null);
            break;
          case 'line':
            setToolParams(DEFAULT_LINE_PARAMS);
            break;
          case 'eraser':
            setToolParams(DEFAULT_ERASER_PARAMS);
            break;
          case 'text':
            setToolParams(DEFAULT_TEXT_PARAMS);
            break;
        }
      }
      return tool;
    });
  };

  useEffect(() => {
    if (tool === 'line') {
      const brushWidth =
        (toolParams as LineCustomizableToolParameters)?.brushWidth ?? 10;
      const brushCursor = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${brushWidth}" height="${brushWidth}">
        <circle cx="${brushWidth / 2}" cy="${brushWidth / 2}" r="${brushWidth / 2}" fill="black"/>
      </svg>
    `;
      const cursorUrl = `url('data:image/svg+xml;utf8,${encodeURIComponent(
        brushCursor
      )}') ${brushWidth / 2} ${brushWidth / 2}, auto`;

      document.documentElement.style.setProperty('--custom-cursor', cursorUrl);
    } else if (tool === 'eraser') {
      const eraserWidth =
        (toolParams as EraserCustomizableToolParameters)?.eraserWidth ?? 10;
      const eraserCursor = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${eraserWidth}" height="${eraserWidth}">
        <circle cx="${eraserWidth / 2}" cy="${eraserWidth / 2}" r="${eraserWidth / 2}" fill="white" stroke="black"/>
      </svg>
    `;
      const cursorUrl = `url('data:image/svg+xml;utf8,${encodeURIComponent(
        eraserCursor
      )}') ${eraserWidth / 2} ${eraserWidth / 2}, auto`;

      document.documentElement.style.setProperty('--custom-cursor', cursorUrl);
    }
  }, [tool, toolParams]);

  return (
    <div className="fixed top-3 z-10 flex flex-row gap-2 w-full justify-center">
      <ToolButton
        isClicked={tool === 'cursor'}
        onClick={() => {
          handleSetToolClick('cursor');
        }}
      >
        <MousePointer2 />
      </ToolButton>
      <ToolButton
        isClicked={tool === 'hand'}
        onClick={() => {
          handleSetToolClick('hand');
        }}
      >
        <Pointer />
      </ToolButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolButton
            isClicked={tool === 'line'}
            onPointerDown={() => {
              handleSetToolClick('line');
            }}
          >
            <Brush />
          </ToolButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="transition-all duration-200 w-55"
          align="center"
        >
          <div className="flex flex-col px-2">
            <div className="flex gap-2 justify-between">
              <Input
                id="brush-width"
                type="range"
                value={
                  (toolParams as LineCustomizableToolParameters)?.brushWidth
                }
                onChange={(e) => {
                  if (tool === 'line' && toolParams) {
                    setToolParams((prev) => {
                      const newLineParams: LineCustomizableToolParameters = {
                        ...(prev as LineCustomizableToolParameters),
                        brushWidth: Number(e.target.value),
                      };
                      return newLineParams;
                    });
                  }
                }}
                min={2}
                max={10}
              />
              <Label htmlFor="brush-width" className="text-[1.1rem]">
                {(toolParams as LineCustomizableToolParameters)?.brushWidth}
              </Label>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <Label htmlFor="brush-color" className="text-[1.1rem]">
                color{' '}
              </Label>
              <div className="text-[1.1rem]">
                {(toolParams as LineCustomizableToolParameters)?.strokeColor}
              </div>
              <Input
                id="brush-color"
                type="color"
                className="w-10 h-10 p-2 border-none cursor-pointer"
                value={
                  (toolParams as LineCustomizableToolParameters)?.strokeColor
                }
                onChange={(e) => {
                  if (tool === 'line' && toolParams) {
                    setToolParams((prev) => {
                      const newLineParams: LineCustomizableToolParameters = {
                        ...(prev as LineCustomizableToolParameters),
                        strokeColor: e.target.value,
                      };
                      return newLineParams;
                    });
                  }
                }}
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolButton
            isClicked={tool === 'eraser'}
            onPointerDown={() => {
              handleSetToolClick('eraser');
            }}
          >
            <Eraser />
          </ToolButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="transition-all duration-200 w-40"
          align="center"
        >
          <div className="flex flex-col px-2 w-full">
            <div className="flex gap-2">
              <Input
                id="eraser-width"
                type="range"
                value={
                  (toolParams as EraserCustomizableToolParameters)?.eraserWidth
                }
                onChange={(e) => {
                  if (tool === 'eraser' && toolParams) {
                    setToolParams((prev) => {
                      const newEraserParams: EraserCustomizableToolParameters =
                        {
                          ...(prev as EraserCustomizableToolParameters),
                          eraserWidth: Number(e.target.value),
                        };
                      return newEraserParams;
                    });
                  }
                }}
                min={2}
                max={30}
              />
              <Label htmlFor="eraser-width" className="text-[1.1rem]">
                {(toolParams as EraserCustomizableToolParameters)?.eraserWidth}
              </Label>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolButton
            isClicked={tool === 'text'}
            onPointerDown={() => {
              handleSetToolClick('text');
            }}
          >
            <TypeOutline />
          </ToolButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="transition-all duration-200">
          <DropdownMenuItem>123</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
