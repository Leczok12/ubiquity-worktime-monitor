import { Container, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiWorker } from '@src/api/api-worker';
import { useParams } from 'react-router';
import WorkerHero from '@src/components/worker-hero';
import { WorkEventsTable, WorkEventsTableRow } from '@src/components/work-events-table';
import { getApiWorkEvents } from '@src/api/api-work-events';
import type { ApiGetWorkEvent } from '@shared/types/api/api-work-event';
import { useState } from 'react';
import WorkEventEditor from '@src/components/work-event-editor';

const WorkerPage = () => {
    const { workerId } = useParams();
    const [editorEventData, setEditorEventData] = useState<ApiGetWorkEvent | undefined>(undefined);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
    ]);

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
        isFetching: workEventsFetching,
        refetch: refetchWorkEvents,
    } = useQuery({
        queryKey: ['work-events', workerId, dateRange],
        queryFn: async () => {
            if (!workerId) {
                throw new Error('Worker ID is required');
            }
            return getApiWorkEvents(
                workerId,
                dateRange[0].toISOString(),
                dateRange[1].toISOString()
            );
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
            <WorkEventEditor
                data={editorEventData!}
                open={isEditorOpen}
                setOpen={setIsEditorOpen}
            />
            <WorkerHero data={data?.data} isLoading={isLoading} />
            {workerId && !isLoading && (
                <WorkEventsTable
                    disabled={workEventsLoading || workEventsFetching}
                    onEdit={(data) => {
                        setEditorEventData(undefined);
                        setIsEditorOpen(true);
                    }}
                    onDateRangeChange={(sinceDate, untilDate) => {
                        console.log('Date range changed:', sinceDate, untilDate);
                        setDateRange([sinceDate, untilDate]);
                        refetchWorkEvents(); // Refetch work events when date range changes
                        // Refetch work events when date range changes
                        // This is a placeholder; you might want to implement a more sophisticated state management or query invalidation
                    }}
                    loading={workEventsLoading}
                    empty={!workEventsData?.data?.length}
                    error={workEventsError?.message}
                >
                    {workEventsData?.data &&
                        workEventsData.data.map((data) => (
                            <WorkEventsTableRow key={data.sinceDate} data={data} />
                        ))}
                </WorkEventsTable>
            )}
        </Container>
    );
};

export default WorkerPage;
