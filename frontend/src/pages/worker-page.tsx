import { Container, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiWorker } from '@src/api/api-worker';
import { useParams } from 'react-router';
import WorkerHero from '@src/components/worker-hero';
import WorkEventsTable from '@src/components/work-events-table';

const WorkerPage = () => {
    const { workerId } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['worker', workerId],
        queryFn: async () => {
            if (!workerId) {
                throw new Error('Worker ID is required');
            }
            return getApiWorker(workerId);
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    if (error) {
        return (
            <Container>
                <Alert.Root variant="subtle" status="error">
                    <Alert.Title>Error</Alert.Title>
                    <Alert.Description>{error.message}</Alert.Description>
                </Alert.Root>
            </Container>
        );
    }

    return (
        <Container pb={20} display={'flex'} flexDirection={'column'} gap={4}>
            <WorkerHero data={data?.data} isLoading={isLoading} />
            {workerId && !isLoading && <WorkEventsTable workerId={workerId} />}
        </Container>
    );
};

export default WorkerPage;
