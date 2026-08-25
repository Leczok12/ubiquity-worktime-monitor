import { CloseButton, Dialog, Heading, Portal } from '@chakra-ui/react';
import { updateApiWorkEvent } from '@src/api/api-work-events';
import { WorkEventsTable, WorkEventsTableRow } from '@src/components/work-events-table';
import WorkEventsTimeline from '@src/components/work-events-timeline';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';
import { useContext, useEffect, useState, type FC } from 'react';

const WorkDayEditor: FC<{
    open?: boolean;
    onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
    const workEventsContext = useContext(WorkEventsContext);

    useEffect(() => {
        if (!workEventsContext.editorEvents) {
            onOpenChange(false);
            return;
        }
        if (!open) {
            setSelectedEventId(undefined);
        }
    }, [open]);

    if (!workEventsContext.editorEvents) {
        return null;
    }

    const since = new Date(workEventsContext.editorEvents.sinceDate);
    const until = new Date(workEventsContext.editorEvents.untilDate);
    const isProcessing = workEventsContext.isProcessing;
    const data = workEventsContext.editorEvents;

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
                                events={isProcessing ? [] : data.workEvents}
                                since={since}
                                until={until}
                            />
                            <WorkEventsTable empty={data.workEvents.length === 0}>
                                {data.workEvents.map((event) => (
                                    <WorkEventsTableRow
                                        onDelete={() => {
                                            workEventsContext.removeEvent(event.id);
                                        }}
                                        key={event.id}
                                        data={event}
                                        disabled={isProcessing}
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
