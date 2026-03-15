import NavBar from '@src/components/navbar';
import { useAuthUser } from '@src/hooks/use-auth-user';
import { Outlet, useNavigate } from 'react-router';

const RootLayout = () => {
    const { data, isLoading, isError, error } = useAuthUser();
    const navigator = useNavigate();

    if (error?.message === 'UNAUTHORIZED') {
        navigator('/auth/login');
    }

    if (data === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar user={data} />
            {data ? <div>Welcome, {data.email}!</div> : <div>Please log in.</div>}
            <Outlet />
        </div>
    );
};

export default RootLayout;
