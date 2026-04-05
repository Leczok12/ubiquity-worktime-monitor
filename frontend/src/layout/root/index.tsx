import { Loader } from '@src/components/loader';
import { Navbar } from '@src/components/navbar';
import { useAuthUser } from '@src/hooks/use-auth-user';
import { UserContext } from '@src/hooks/use-user-context';
import { Navigate, Outlet, useLocation } from 'react-router';

const RootLayout = () => {
    const { data, isLoading, error } = useAuthUser();
    const location = useLocation();

    if (error?.message === 'UNAUTHORIZED') {
        return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    if (data === undefined || isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <UserContext.Provider value={data}>
                <Navbar />
                <Outlet />
            </UserContext.Provider>
        </div>
    );
};

export default RootLayout;
