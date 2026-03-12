import { Board, ToolContextProvider } from '@/widgets/Board';
import { SocketContextProvider } from '@/widgets/Board/provider/SocketContextProvider';
import { ToolPanel } from '@/widgets/ToolPanel';
export function BoardPage() {
  return (
    <SocketContextProvider>
      <ToolContextProvider>
        <div>
          <ToolPanel />
          <Board />
        </div>
      </ToolContextProvider>
    </SocketContextProvider>
  );
}
