import { Button } from '@/shared/ui/button';
import type { ReactNode } from 'react';

interface ToolButtonProps {
  isClicked: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const ToolButton = ({
  isClicked,
  onClick,
  children,
  ...props
}: ToolButtonProps & React.ComponentProps<'button'>) => {
  return (
    <Button
      className={`w-15 h-15 border-2 ${isClicked ? 'bg-gray-400 hover:bg-gray-500 ' : ''} `}
      variant="outline"
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};
