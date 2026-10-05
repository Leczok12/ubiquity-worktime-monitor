import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiConfig } from '@src/api/api-config';
import {
    AdminConfigurationTable,
    AdminConfigurationTableRow,
} from '@src/components/admin-configuration-table';

const AdminConfigPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'configuration'],
        queryFn: async () => {
            return getApiConfig();
        },
        staleTime: 0,
        gcTime: 0,
    });

    return (
        <Container pb={20}>
            <Heading size="4xl" mb={6}>
                Configuration
            </Heading>
            <Heading size="xs" mb={4}>
                To modify the configuration, please edit the environment variables in the backend
                and restart the server.
            </Heading>
            <AdminConfigurationTable
                loading={isLoading}
                error={error?.message}
                empty={data?.data?.length === 0}
            >
                {data?.data?.map((config) => (
                    <AdminConfigurationTableRow key={config.name} data={config} />
                ))}
            </AdminConfigurationTable>
        </Container>
    );
};

export default AdminConfigPage;
