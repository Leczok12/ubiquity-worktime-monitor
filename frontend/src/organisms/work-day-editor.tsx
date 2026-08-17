import { Center, CloseButton, Dialog, Heading, Portal, Spinner } from '@chakra-ui/react';
import { getApiWorkEvents } from '@src/api/api-work-events';
import { WorkEventsTable, WorkEventsTableRow } from '@src/components/work-events-table';
import WorkEventsTimeline from '@src/components/work-events-timeline';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type FC } from 'react';

const WorkDayEditor: FC<{
    dateRange?: [Date, Date];
    workerId?: string;
    open?: boolean;
    onOpenChange: (open: boolean) => void;
}> = ({ dateRange, workerId, open, onOpenChange }) => {
    const [since, until] = dateRange || [new Date(), new Date()];
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['work-events', workerId, dateRange],
        queryFn: async () => {
            if (!workerId) {
                throw new Error('Worker ID is required');
            }
            return getApiWorkEvents(workerId, since.toISOString(), until.toISOString());
        },
    });

    useEffect(() => {
        if (!open) {
            setSelectedEventId(undefined);
        }
    }, [open]);

    console.log(isLoading, isFetching, data);

    return (
        <Dialog.Root
            scrollBehavior={'inside'}
            placement={'center'}
            open={open}
            size="cover"
            onOpenChange={(e) => onOpenChange(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                        <Dialog.Header display={'flex'} flexDirection={'column'} gap={2}>
                            <Dialog.Title>Work day editor</Dialog.Title>
                            <Heading size="sm" m={0} p={0} opacity={0.5}>
                                {since.toLocaleString()} to {until.toLocaleString()}
                            </Heading>
                        </Dialog.Header>
                        <Dialog.Body display={'flex'} flexDirection={'column'} gap={4}>
                            <WorkEventsTimeline
                                showHours
                                size="lg"
                                selectedEventId={selectedEventId}
                                events={isLoading || isFetching ? [] : (data?.data ?? [])}
                                since={since}
                                until={until}
                            />
                            <WorkEventsTable
                                loading={isLoading || isFetching}
                                error={error?.message}
                                empty={data?.data ? data?.data.length === 0 : false}
                            >
                                {data?.data &&
                                    data.data.map((event) => (
                                        <WorkEventsTableRow
                                            key={event.id}
                                            data={event}
                                            onHover={setSelectedEventId}
                                        />
                                    ))}
                            </WorkEventsTable>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkDayEditor;
