import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/root-layout';
import AdminLayout from '../layouts/admin-layout';
import AuthLayout from '@src/layouts/auth-layout';

import AdminGroupPage from '@src/pages/admin-group-page';
import AdminDevicePage from '@src/pages/admin-device-page';
import AdminHomePage from '@src/pages/admin-home-page';
import AdminWorkerPage from '@src/pages/admin-worker-page';
import AdminUsersPage from '@src/pages/admin-user-page';
import AdminConfigPage from '@src/pages/admin-config-page';

import AuthLoginPage from '@src/pages/auth-login-page';
import AuthLogoutPage from '@src/pages/auth-logout-page';

import HomePage from '../pages/home-page';
import WorkerPage from '@src/pages/worker-page';
import ErrorPage from '@src/pages/error-page';

const router = createBrowserRouter([
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminHomePage /> },
            { path: 'workers', element: <AdminWorkerPage /> },
            { path: 'devices', element: <AdminDevicePage /> },
            { path: 'groups', element: <AdminGroupPage /> },
            { path: 'config', element: <AdminConfigPage /> },
            { path: 'users', element: <AdminUsersPage /> },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <AuthLoginPage /> },
            { path: 'logout', element: <AuthLogoutPage /> },
        ],
    },
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'worker', element: <WorkerPage /> },
            { path: 'worker/:workerId', element: <WorkerPage /> },
        ],
    },
]);

export { router };
