import { Container, Heading } from '@chakra-ui/react';
import { getApiStatistics } from '@src/api/api-statistics';
import Statistics from '@src/components/statistics';
import { useQuery } from '@tanstack/react-query';

const AdminHomePage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'statistics'],
        queryFn: async () => {
            return getApiStatistics(true);
        },
        retry: false,
        staleTime: 0,
        gcTime: 0,
    });

    console.log('AdminHomePage data:', data);

    return (
        <Container pb={20}>
            <Heading size="4xl" mb={6}>
                Admin Dashboard
            </Heading>
            <Statistics data={data?.data} loading={isLoading} error={error?.message} />
        </Container>
    );
};

export default AdminHomePage;
