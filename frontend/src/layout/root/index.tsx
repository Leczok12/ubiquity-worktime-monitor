import { Navbar } from '@src/components/navbar';
import { useAuthUser } from '@src/hooks/use-auth-user';
import { Outlet, useNavigate } from 'react-router';

const RootLayout = () => {
    const { data, error } = useAuthUser();
    const navigator = useNavigate();

    if (error?.message === 'UNAUTHORIZED') {
        navigator('/auth/login');
    }

    if (data === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar user={data} />
            <Outlet />
        </div>
    );
};

export default RootLayout;
