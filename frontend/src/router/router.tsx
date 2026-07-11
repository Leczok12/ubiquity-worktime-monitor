import { createBrowserRouter } from 'react-router';
import HomePage from '../pages/home-page';
import RootLayout from '../layouts/root-layout';
import AdminLayout from '../layouts/admin-layout';
import AuthLayout from '@src/layouts/auth-layout';

import AdminGroupPage from '@src/pages/admin-group-page';
import AdminDevicePage from '@src/pages/admin-device-page';
import AdminHomePage from '@src/pages/admin-home-page';
import AdminWorkerPage from '@src/pages/admin-worker-page';
import AuthLoginPage from '@src/pages/auth-login-page';

const router = createBrowserRouter([
    // {
    //     path: '/auth',
    //     element: <AuthLayout />,
    //     children: [
    //         { path: 'login', element: <LoginPage /> },
    //         { path: 'logout', element: <LogoutPage /> },
    //         { path: 'change-password', element: <ChangePasswordPage /> },
    //     ],
    //     errorElement: <div>Auth route error</div>,
    // },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { path: '', element: <AdminHomePage /> },
            { path: 'workers', element: <AdminWorkerPage /> },
            { path: 'devices', element: <AdminDevicePage /> },
            { path: 'groups', element: <AdminGroupPage /> },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [{ path: 'login', element: <AuthLoginPage /> }],
    },
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { path: '', element: <HomePage /> },
            // { path: 'worker/:workerId', element: <WorkerPage /> },
        ],
    },

    //   {
    //     path: "/about",
    //     element: <About />,
    //   },
]);

export { router };
