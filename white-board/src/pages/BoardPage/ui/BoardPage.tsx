import { Board, ToolContextProvider } from '@/widgets/Board';
import { SocketContextProvider } from '@/features/socket/provider/SocketContextProvider';
import { ToolPanel } from '@/widgets/ToolPanel';
import { SocketGate } from '@/features/socket';
export function BoardPage() {
  return (
    <SocketContextProvider>
      <ToolContextProvider>
        <SocketGate>
          <ToolPanel />
          <Board />
        </SocketGate>
      </ToolContextProvider>
    </SocketContextProvider>
  );
}
