import { BoardPage } from '@/pages/BoardPage';
import { MainPage } from '@/pages/MainPage/';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/:roomId', element: <BoardPage /> },
  { path: '*', element: <MainPage /> },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
