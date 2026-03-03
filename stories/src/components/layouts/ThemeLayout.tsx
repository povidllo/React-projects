import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react';

interface ThemeContextType {
  handleChangeTheme: () => void;
}

interface Props {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeLayout({ children }: Props) {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') ?? 'light';
  });

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
  }, [theme]);

  const handleChangeTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ handleChangeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeLayout');
  return context;
};
