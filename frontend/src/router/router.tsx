import { createBrowserRouter } from 'react-router';
import LoginPage from '../pages/auth/login';
import AuthLayout from '../layout/auth';
import LogoutPage from '../pages/auth/logout';

const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'logout', element: <LogoutPage /> },
        ],
    },

    //   {
    //     path: "/about",
    //     element: <About />,
    //   },
]);

export { router };
