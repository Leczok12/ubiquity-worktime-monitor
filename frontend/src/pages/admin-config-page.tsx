import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiConfig } from '@src/api/api-config';
import { AdminConfigurationTable } from '@src/components/admin-configuration-table';

const AdminConfigPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'configuration'],
        queryFn: async () => {
            return getApiConfig();
        },
        staleTime: 100 * 60 * 5,
        gcTime: 100 * 60 * 10,
    });

    return (
        <Container gap={6} display="flex" flexDirection="column">
            <Heading size="4xl">Configuration</Heading>
            <Heading size="xs">
                To modify the configuration, please edit the environment variables in the backend
                and restart the server.
            </Heading>
            <AdminConfigurationTable loading={isLoading} error={error?.message} data={data?.data} />
        </Container>
    );
};

export default AdminConfigPage;
