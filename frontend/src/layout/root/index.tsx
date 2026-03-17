import { Navbar } from '@src/components/navbar';
import { useAuthUser } from '@src/hooks/use-auth-user';
import { Navigate, Outlet, useLocation } from 'react-router';

const RootLayout = () => {
    const { data, error } = useAuthUser();
    const location = useLocation();

    if (error?.message === 'UNAUTHORIZED') {
        return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    if (data === undefined) {
        return <></>;
    }

    return (
        <div>
            <Navbar user={data} />
            <Outlet />
        </div>
    );
};

export default RootLayout;
