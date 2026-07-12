import { Box, Button, Flex, Heading, Menu, Portal } from '@chakra-ui/react';
import { getApiAuthUser } from '@src/api/api-auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';

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
        <>
            <Flex
                zIndex={9999}
                position="fixed"
                bg="gray.800"
                top={0}
                left={0}
                h="60px"
                w="full"
                pl="20px"
                pr="20px"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Heading color="white" size="xl" onClick={() => navigator('/')} cursor="pointer">
                    Worktime monitor
                </Heading>

                <Menu.Root>
                    <Menu.Trigger>
                        <Button variant="ghost">{data.data?.email}</Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content bg="gray.600">
                                {data.data?.role === 'SYSTEM_ADMIN' && (
                                    <>
                                        <Menu.Item
                                            value="admin-dashboard"
                                            onSelect={() => navigator('/admin')}
                                        >
                                            Admin dashboard
                                        </Menu.Item>
                                        <Menu.Separator />
                                    </>
                                )}
                                {data.data?.workerId && (
                                    <>
                                        <Menu.Item
                                            value="my-work-time"
                                            onSelect={() =>
                                                navigator(`/worker/${data.data?.workerId}`)
                                            }
                                        >
                                            My work time
                                        </Menu.Item>
                                        <Menu.Separator />
                                    </>
                                )}
                                <Menu.Item
                                    value="logout"
                                    onSelect={() => navigator('/auth/logout')}
                                >
                                    Logout
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
                {/* <Flex direction="column" h="full">
                    {links.map((link) => (
                        <NavButton
                            key={link.label}
                            label={link.label}
                            icon={link.icon}
                            onClick={link.onClick}
                            highlighted={location.pathname === link.path}
                        />
                    ))}
                </Flex> */}

                {/* <NavButton label="Home page" icon={GrHomeRounded} onClick={() => navigator('/')} /> */}
            </Flex>
            <Box pt="80px" pb="20px">
                <Outlet />
            </Box>
        </>
    );
};

export default RootLayout;
