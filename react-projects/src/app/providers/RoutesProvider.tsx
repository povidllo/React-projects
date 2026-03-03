import { createBrowserRouter } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import TicTacToePage from '@/pages/TicTacToe';
import CurrencyConverterPage from '@/pages/CurrentcyConverter';

export const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/tictactoe', element: <TicTacToePage /> },
  { path: '/currency-converter', element: <CurrencyConverterPage /> },
]);
