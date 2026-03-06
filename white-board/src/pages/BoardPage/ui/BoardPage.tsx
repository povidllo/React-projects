import { Board, ToolContextProvider } from '@/widgets/Board';
import { ToolPanel } from '@/widgets/ToolPanel';
export function BoardPage() {
  return (
    <ToolContextProvider>
      <div>
        <ToolPanel />
        <Board />
      </div>
    </ToolContextProvider>
  );
}
