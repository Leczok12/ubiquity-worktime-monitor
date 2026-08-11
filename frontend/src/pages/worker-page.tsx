import { Container, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiWorker } from '@src/api/api-worker';
import { useParams } from 'react-router';
import WorkerHero from '@src/components/worker-hero';
import { WorkEventsTable, WorkEventsTableRow } from '@src/components/work-events-table';
import { getApiWorkEvents } from '@src/api/api-work-events';

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

    const {
        data: workEventsData,
        isLoading: workEventsLoading,
        error: workEventsError,
    } = useQuery({
        queryKey: ['work-events', workerId],
        queryFn: async () => {
            if (!workerId) {
                throw new Error('Worker ID is required');
            }
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            const endDate = new Date();
            return getApiWorkEvents(workerId, startDate.toISOString(), endDate.toISOString());
        },
        enabled: isLoading === false,
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
            {workerId && !isLoading && (
                <WorkEventsTable
                    loading={workEventsLoading}
                    empty={!workEventsData?.data?.length}
                    error={workEventsError?.message}
                >
                    {workEventsData?.data &&
                        workEventsData.data.map((data) => (
                            <>
                                <WorkEventsTableRow key={data.startDate} data={data} />
                                <WorkEventsTableRow key={data.startDate} data={data} />
                                <WorkEventsTableRow key={data.startDate} data={data} />
                                <WorkEventsTableRow key={data.startDate} data={data} />
                            </>
                        ))}
                </WorkEventsTable>
            )}
        </Container>
    );
};

export default WorkerPage;
