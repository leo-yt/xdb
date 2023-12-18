import Home from '../pages/Home';
import NotFound from "../pages/NotFound";

interface IRoutes {
  path: string,
  element: any,
  title?: string
}

const routes: IRoutes[] = [
  {
    path: '*',
    element: NotFound,
  },
  {
    path: '/',
    element: Home,
  },

]

export default routes;