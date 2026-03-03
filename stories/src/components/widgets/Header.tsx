import { useTheme } from '../layouts/ThemeLayout';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export const Header = () => {
  const theme = useTheme();
  return (
    <header className="flex flex-col py-4">
      <Button
        onClick={() => {
          theme.handleChangeTheme();
        }}
        className="w-fit self-end mr-4"
      >
        Theme
      </Button>
      <Separator className="border-2 opacity-50 mt-4" />
    </header>
  );
};
