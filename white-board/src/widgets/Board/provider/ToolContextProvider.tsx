import type { ToolParamsType, ToolType } from '@/entities/tools';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface ToolContextProps {
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
  toolParams: ToolParamsType | null;
  setToolParams: React.Dispatch<React.SetStateAction<ToolParamsType | null>>;
}
const toolContext = createContext<ToolContextProps | null>(null);

export const ToolContextProvider = ({ children }: Props) => {
  const [tool, setTool] = useState<ToolType>('cursor');
  const [toolParams, setToolParams] = useState<ToolParamsType | null>(null);

  return (
    <toolContext.Provider value={{ tool, setTool, toolParams, setToolParams }}>
      {children}
    </toolContext.Provider>
  );
};

export const useToolContext = () => {
  const context = useContext(toolContext);

  if (!context) {
    throw new Error('tool context empty');
  }

  return context;
};
