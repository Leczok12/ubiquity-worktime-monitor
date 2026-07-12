import { IconButton, Icon, Flex, Box } from '@chakra-ui/react';
import { Tooltip } from '../components/ui/tooltip';
import type { IconType } from 'react-icons';
import { VscDeviceMobile } from 'react-icons/vsc';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { GrGroup, GrUser, GrUserWorker, GrHomeRounded, GrDashboard } from 'react-icons/gr';
import { FaGear } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getApiAuthUser } from '@src/api/api-auth';

const AdminLayout = () => {
    const navigator = useNavigate();
    const location = useLocation();

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
        } else if (data?.status === 'SUCCESS' && data.data?.role !== 'SYSTEM_ADMIN') {
            navigator('/');
        }
    }, [data, navigator]);

    if (isLoading || !data) {
        return null;
    }

    const links = [
        { label: 'Home', icon: GrDashboard, path: '/admin', onClick: () => navigator('/admin') },
        {
            label: 'Workers',
            icon: GrUserWorker,
            path: '/admin/workers',
            onClick: () => navigator('/admin/workers'),
        },
        {
            label: 'Groups',
            icon: GrGroup,
            path: '/admin/groups',
            onClick: () => navigator('/admin/groups'),
        },
        {
            label: 'Devices',
            icon: VscDeviceMobile,
            path: '/admin/devices',
            onClick: () => navigator('/admin/devices'),
        },
        {
            label: 'Users',
            icon: GrUser,
            path: '/admin/users',
            onClick: () => navigator('/admin/users'),
        },
        {
            label: 'Config',
            icon: FaGear,
            path: '/admin/config',
            onClick: () => navigator('/admin/config'),
        },
    ];

    console.log('AdminLayout rendered');

    const NavButton: React.FC<{
        label: string;
        icon: IconType;
        onClick: () => void;
        highlighted?: boolean;
    }> = ({ label, icon, onClick, highlighted = false }) => {
        return (
            <Tooltip content={label} positioning={{ placement: 'right' }}>
                <IconButton
                    aria-label={label}
                    variant={highlighted ? 'solid' : 'ghost'}
                    onClick={onClick}
                    m={2}
                    transition="background-color 0.2s"
                    w={'fit-content'}
                    rounded="lg"
                    size="lg"
                >
                    <Icon as={icon} size="lg" />
                </IconButton>
            </Tooltip>
        );
    };

    return (
        <>
            <Flex
                zIndex={9999}
                position="fixed"
                bg="gray.800"
                top={0}
                left={0}
                h="full"
                w="60px"
                flexDirection="column"
                alignItems="left"
            >
                <Flex direction="column" h="full">
                    {links.map((link) => (
                        <NavButton
                            key={link.label}
                            label={link.label}
                            icon={link.icon}
                            onClick={link.onClick}
                            highlighted={location.pathname === link.path}
                        />
                    ))}
                </Flex>

                <NavButton label="Home page" icon={GrHomeRounded} onClick={() => navigator('/')} />
            </Flex>
            <Box ml="60px" pt="20px" pb="20px">
                <Outlet />
            </Box>
        </>
    );
};

export default AdminLayout;
