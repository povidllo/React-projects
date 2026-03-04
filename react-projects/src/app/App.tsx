import { RouterProvider } from 'react-router-dom';
import { router } from './providers/RoutesProvider';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
