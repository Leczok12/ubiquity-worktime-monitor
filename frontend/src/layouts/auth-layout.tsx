import { AbsoluteCenter } from '@chakra-ui/react';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <AbsoluteCenter>
            <Outlet />
        </AbsoluteCenter>
    );
};

export default AuthLayout;
