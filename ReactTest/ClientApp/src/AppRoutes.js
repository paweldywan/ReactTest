import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./components/Counter";
import { FetchData  } from "./components/FetchData";
import { Home } from "./components/Home";

const AppRoutes = [
    {
        index: true,
        element: <Home />,
        name: 'Home'
    },
    {
        path: '/counter',
        element: <Counter />,
        name: 'Counter'
    },
    {
        path: '/fetch-data',
        requireAuth: true,
        element: <FetchData />,
        name: 'FetchData'
    },
    ...ApiAuthorzationRoutes
];

export default AppRoutes;
