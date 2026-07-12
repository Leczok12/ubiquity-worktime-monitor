import { Alert, Button, Card, Heading, IconButton, Input } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa6';
import { getApiAuthConfig } from '@src/api/api-auth';
import { useNavigate } from 'react-router';

const AuthLoginPage = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | undefined>(undefined);
    const { data, isLoading, error } = useQuery({
        queryKey: ['auth', 'config'],
        queryFn: getApiAuthConfig,
        retry: false,
        staleTime: 0,
        gcTime: 0,
    });

    if (!data || isLoading) {
        return null;
    }

    if (error) {
        return (
            <Alert.Root variant="subtle" status="error" w={'300px'}>
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>{error?.message}</Alert.Description>
            </Alert.Root>
        );
    }

    return (
        <Card.Root w={'300px'}>
            <Card.Header>
                <Heading textAlign="center" size="xl" mb={6}>
                    Login
                </Heading>
            </Card.Header>
            <Card.Body
                display="flex"
                flexDirection="column"
                gap={4}
                as="form"
                onSubmit={(e) => {
                    setLoginError('sadasd');
                    e.preventDefault();
                }}
            >
                <Input placeholder="Username" />
                <Input placeholder="Password" type="password" />
                {loginError && (
                    <Alert.Root variant="subtle" status="error">
                        <Alert.Description>{loginError}</Alert.Description>
                    </Alert.Root>
                )}
                <Button variant="subtle" type="submit">
                    Login
                </Button>
                {data.data?.microsoft?.enabled || data.data?.google?.enabled ? <hr /> : null}
                {data.data?.microsoft?.enabled && (
                    <IconButton
                        variant="subtle"
                        aria-label="User"
                        onClick={() => navigate('/api/auth/microsoft/?redirect=/')}
                    >
                        <FaMicrosoft /> {data.data?.microsoft?.loginLabel}
                    </IconButton>
                )}
                {data.data?.google?.enabled && (
                    <IconButton
                        variant="subtle"
                        aria-label="User"
                        onClick={() => navigate('/api/auth/google/?redirect=/')}
                    >
                        <FaGoogle /> {data.data?.google?.loginLabel}
                    </IconButton>
                )}
            </Card.Body>
        </Card.Root>
        // <Container pb={20}>
        //     <Heading size="4xl" mb={6}>
        //         Workers
        //     </Heading>
        //     <WorkerSearchBar
        //         onSearch={(keyword, groupId) => {
        //             setKeyword(keyword);
        //             setGroupId(groupId);
        //             setPageNumber(1);
        //             refetch();
        //         }}
        //     />
        //     <AdminWorkerTable
        //         loading={isLoading || isFetching}
        //         error={error?.message}
        //         empty={data?.data?.length === 0}
        //     >
        //         {data?.data?.map((worker) => (
        //             <AdminWorkerTableRow key={worker.id} data={worker} />
        //         ))}
        //     </AdminWorkerTable>
        //     <Pagination
        //         show={data !== undefined}
        //         pageNumber={pageNumber}
        //         count={data?.pagination?.total || 1}
        //         pageSize={data?.pagination?.pageSize || 10}
        //         onPageChange={(details) => {
        //             setPageNumber(details.page);
        //         }}
        //     />
        // </Container>
    );
};

export default AuthLoginPage;
