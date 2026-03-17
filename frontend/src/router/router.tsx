import { createBrowserRouter } from 'react-router';
import { LoginPage, LogoutPage } from '../pages/auth';
import AuthLayout from '../layout/auth';
import RootLayout from '@src/layout/root';
import { HomePage } from '@src/pages/home';

const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'logout', element: <LogoutPage /> },
        ],
        errorElement: <div>Auth route error</div>,
    },
    {
        path: '/',
        element: <RootLayout />,
        children: [{ path: '/', element: <HomePage /> }],
    },

    //   {
    //     path: "/about",
    //     element: <About />,
    //   },
]);

export { router };
