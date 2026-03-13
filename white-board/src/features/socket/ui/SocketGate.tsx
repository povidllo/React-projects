import { Children, type ReactNode } from 'react';
import { useSocketContext } from '../provider/SocketContextProvider';
import { LoaderCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export const SocketGate = ({ children }: Props) => {
  const { isConnected, isError } = useSocketContext();
  if (isError) {
    return (
      <div className="flex min-h-screen">
        <div className="m-auto text-2xl">Произошла ошибка загрузки...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen">
        <div className="m-auto">
          <LoaderCircle className="animate-spin h-15 w-15" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
