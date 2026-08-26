import { CloseButton, Dialog, Heading, Portal } from '@chakra-ui/react';
import { updateApiWorkEvent } from '@src/api/api-work-events';
import Alert from '@src/components/alert';
import { WorkEventsTable, WorkEventsTableRow } from '@src/components/work-events-table';
import WorkEventsTimeline from '@src/components/work-events-timeline';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';
import { useContext, useEffect, useState, type FC } from 'react';

const WorkDayEditor: FC<{
    index?: number;
    open?: boolean;
    onOpenChange: (open: boolean) => void;
}> = ({ index, open, onOpenChange }) => {
    const workEventsContext = useContext(WorkEventsContext);

    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!open) setSelectedEventId(undefined);
        if (open) setError(undefined);
    }, [open]);

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

                        {(() => {
                            if (
                                workEventsContext.eventsGrouped === undefined ||
                                index === undefined ||
                                index < 0 ||
                                index >= workEventsContext.eventsGrouped.length ||
                                error !== undefined
                            ) {
                                return (
                                    <>
                                        <Dialog.Header
                                            display={'flex'}
                                            flexDirection={'column'}
                                            gap={2}
                                        >
                                            <Dialog.Title>Work day editor</Dialog.Title>
                                            <Heading size="sm" m={0} p={0} opacity={0.5}>
                                                --- to ---
                                            </Heading>
                                        </Dialog.Header>
                                        <Dialog.Body
                                            display={'flex'}
                                            flexDirection={'column'}
                                            gap={4}
                                        >
                                            <Alert
                                                status="error"
                                                title="Error"
                                                description={(() => {
                                                    if (error !== undefined) return error;
                                                    if (index === undefined)
                                                        return 'No index provided';
                                                    if (index < 0) return 'Index is less than 0';
                                                    if (
                                                        workEventsContext.eventsGrouped ===
                                                        undefined
                                                    )
                                                        return 'Events are not loaded yet';
                                                    if (
                                                        index >=
                                                        workEventsContext.eventsGrouped.length
                                                    )
                                                        return 'Index is out of bounds';
                                                    return 'Unknown error';
                                                })()}
                                            />
                                        </Dialog.Body>
                                    </>
                                );
                            }

                            const since = new Date(
                                workEventsContext.eventsGrouped[index].sinceDate
                            );
                            const until = new Date(
                                workEventsContext.eventsGrouped[index].untilDate
                            );
                            const isProcessing = workEventsContext.isProcessing;
                            const data = workEventsContext.eventsGrouped[index];

                            return (
                                <>
                                    <Dialog.Header
                                        display={'flex'}
                                        flexDirection={'column'}
                                        gap={2}
                                    >
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
                                            events={data.workEvents}
                                            since={since}
                                            until={until}
                                        />
                                        <WorkEventsTable
                                            empty={data ? data.workEvents.length === 0 : false}
                                        >
                                            {data?.workEvents.map((event) => (
                                                <WorkEventsTableRow
                                                    onDelete={() => {
                                                        workEventsContext
                                                            .removeEvent(event.id + 'as')
                                                            .catch((e) => {
                                                                setError(
                                                                    `Failed to delete work event: ${e.message}`
                                                                );
                                                            });
                                                    }}
                                                    key={event.id}
                                                    data={event}
                                                    disabled={isProcessing}
                                                    onHover={setSelectedEventId}
                                                />
                                            ))}
                                        </WorkEventsTable>
                                    </Dialog.Body>
                                </>
                            );
                        })()}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkDayEditor;
