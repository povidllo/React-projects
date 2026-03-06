import {
  DEFAULT_ERASER_PARAMS,
  DEFAULT_LINE_PARAMS,
  DEFAULT_TEXT_PARAMS,
} from '@/entities/tools';
import { Button } from '@/shared/ui/button';
import { useToolContext } from '@/widgets/Board';
import { createPortal } from 'react-dom';

export function ToolPanel() {
  const { tool, setTool, toolParams, setToolParams } = useToolContext();

  const setCursor = () => {
    setTool('cursor');
    console.log('cursor');
    setToolParams(null);
  };
  const setHand = () => {
    setTool('hand');
    console.log('hand');

    setToolParams(null);
  };
  const setLine = () => {
    setTool('line');
    console.log('line');

    setToolParams(DEFAULT_LINE_PARAMS);
  };
  const setEraser = () => {
    setTool('eraser');
    console.log('eraser');

    setToolParams(DEFAULT_ERASER_PARAMS);
  };
  const setText = () => {
    setTool('text');
    console.log('text');

    setToolParams(DEFAULT_TEXT_PARAMS);
  };

  return (
    <div className="fixed top-3 z-10 flex flex-row gap-2 w-full justify-center">
      <Button className="border-2" variant="outline" onClick={setCursor}>
        cursor
      </Button>
      <Button className="border-2" variant="outline" onClick={setHand}>
        hand
      </Button>
      <Button className="border-2" variant="outline" onClick={setLine}>
        brush
      </Button>
      <Button className="border-2" variant="outline" onClick={setEraser}>
        eraser
      </Button>
      <Button className="border-2" variant="outline" onClick={setText}>
        text
      </Button>
    </div>
  );
}
