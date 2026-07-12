import { getApiAuthUser } from '@src/api/api-auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

const RootLayout = () => {
    const navigator = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: getApiAuthUser,
        retry: false,
        staleTime: 0, // 5 minutes
        gcTime: 0, // 10 minutes
    });

    console.log('AdminLayout data:', data, error);

    useEffect(() => {
        if (data?.status === 'UNAUTHORIZED') {
            navigator('/auth/login');
        }
        if (data?.status === 'SUCCESS' && data.data?.role === 'WORKER') {
            navigator(`/worker/${data.data.workerId}`);
        }
    }, [data, navigator]);

    if (isLoading || !data) {
        return null;
    }

    return (
        <div>
            <header>Header</header>
            <main>
                <Outlet />
            </main>
            <footer>Footer</footer>
        </div>
    );
};

export default RootLayout;
