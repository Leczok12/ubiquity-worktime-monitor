import { createBrowserRouter } from 'react-router';
import HomePage from '../pages/home-page';
import RootLayout from '../layouts/root-layout';
import AdminLayout from '../layouts/admin-layout/admin-layout';

import AdminHomePage from '../pages/admin-home-page';

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
            { index: true, element: <AdminHomePage /> },
            { path: 'device', element: <AdminHomePage /> },
        ],
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
