import { createBrowserRouter } from 'react-router';
import { LoginPage, LogoutPage } from '../pages/auth';

import AuthLayout from '../layout/auth';
import RootLayout from '@src/layout/root';
import AdminLayout from '@src/layout/admin';

import { HomePage } from '@src/pages/home';
import { WorkerPage } from '@src/pages/worker';
import ChangePasswordPage from '@src/pages/auth/change-password';
import { DevicePage } from '@src/pages/admin';

const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'logout', element: <LogoutPage /> },
            { path: 'change-password', element: <ChangePasswordPage /> },
        ],
        errorElement: <div>Auth route error</div>,
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [{ path: 'device', element: <DevicePage /> }],
    },
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'worker/:workerId', element: <WorkerPage /> },
        ],
    },

    //   {
    //     path: "/about",
    //     element: <About />,
    //   },
]);

export { router };
