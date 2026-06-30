import { Loader } from '@src/components/loader';
import { useAuthUser } from '@src/hooks/use-auth-user';
import { UserContext } from '@src/hooks/use-user-context';
import { Navbar } from '@src/components/navbar';
import { Outlet, useNavigate } from 'react-router';

const AdminLayout = () => {
    const { data, isLoading, error } = useAuthUser();
    const navigator = useNavigate();

    if (data === undefined || isLoading) {
        return <Loader />;
    }

    if (data.role !== 'SYSTEM_ADMIN' || !!error) {
        console.error('Unauthorized access to admin layout', error);
        navigator('/', { replace: true });
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

export default AdminLayout;
