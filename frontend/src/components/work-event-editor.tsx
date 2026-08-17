import { Button, CloseButton, Dialog, Heading, Portal, Table } from '@chakra-ui/react';
import type { ApiGetWorkEvent, ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { useEffect, useState, type FC } from 'react';
import WorkEventsTimeline from './work-events-timeline';
import { WorkEventsTable, WorkEventsTableRow } from './work-events-table';

const WorkEventEditor: FC<{
    data: ApiGetWorkEventGrouped | undefined;
    open: boolean;
    setOpen: (open: boolean) => void;
}> = ({ data, open, setOpen }) => {
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!open) {
            setSelectedEventId(undefined);
        }
    }, [open]);

    if (!data) {
        return null;
    }
    return (
        <Dialog.Root
            scrollBehavior={'inside'}
            placement={'center'}
            open={open}
            size="cover"
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                        <Dialog.Header display={'flex'} flexDirection={'column'} gap={2}>
                            <Dialog.Title>Event Editor</Dialog.Title>
                            <Heading size="sm" m={0} p={0} opacity={0.5}>
                                {new Date(data.sinceDate).toLocaleString()} to{' '}
                                {new Date(data.untilDate).toLocaleString()}
                            </Heading>
                        </Dialog.Header>
                        <Dialog.Body display={'flex'} flexDirection={'column'} gap={4}>
                            <iframe
                                src="/worker/c1635360-6dc9-477f-a3d8-918ad211c021"
                                width="100%"
                                height="400px"
                            />
                            {/* <WorkEventsTimeline
                                showHours
                                size="lg"
                                selectedEventId={selectedEventId}
                                events={data.workEvents}
                                since={new Date(new Date(data.sinceDate).getTime())}
                                until={new Date(data.untilDate)}
                            />
                            <WorkEventsTable isEmpty={data.workEvents.length === 0}>
                                {data.workEvents.map((event) => (
                                    <WorkEventsTableRow
                                        key={event.id}
                                        data={event}
                                        onHover={setSelectedEventId}
                                    />
                                ))}
                            </WorkEventsTable> */}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkEventEditor;
