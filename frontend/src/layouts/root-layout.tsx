import { Box, Button, Flex, Heading, Menu, Portal, Span } from '@chakra-ui/react';
import { getApiAuthUser } from '@src/api/api-auth';
import { UserContext } from '@src/hooks/use-user-context';
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
        <UserContext.Provider value={data.data}>
            <Flex
                zIndex={1000}
                position="fixed"
                bg="gray.800"
                top={0}
                left={0}
                sm={{ h: '60px' }}
                h="80px"
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
                        <Heading color="white" size="md" cursor="pointer">
                            {data.data?.email}
                        </Heading>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content
                                bg="gray.600"
                                zIndex={9000}
                                borderRadius="md"
                                p={2}
                                minW="200px"
                            >
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
            </Flex>
            <Box sm={{ pt: '80px' }} pt="100px" pb="20px">
                <Outlet />
            </Box>
        </UserContext.Provider>
    );
};

export default RootLayout;
