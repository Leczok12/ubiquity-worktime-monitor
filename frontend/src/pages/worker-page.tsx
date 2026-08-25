import { Container, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiWorker } from '@src/api/api-worker';
import { useParams } from 'react-router';
import WorkerHero from '@src/components/worker-hero';
import { WorkDayTable, WorkDayTableRow } from '@src/components/work-day-table';
import { getApiWorkEventsGrouped, updateApiWorkEvent } from '@src/api/api-work-events';
import type {
    ApiCreateWorkEvent,
    ApiGetWorkEvent,
    ApiGetWorkEventGrouped,
} from '@shared/types/api/api-work-event';
import { createContext, useState } from 'react';
import WorkEventEditor from '@src/components/work-event-editor';
import WorkDayEditor from '@src/organisms/work-day-editor';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';
import { useLocalStorage } from '@src/hooks/use-local-storage';

const WorkerPage = () => {
    const { workerId } = useParams();
    const [lastDateRange, setLastDateRange] = useLocalStorage<{
        updated: string;
        since: string;
        until: string;
    }>('lastDateRange', {
        updated: new Date().toISOString(),
        since: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
        until: new Date().toISOString(),
    });

    const [editorEventData, setEditorEventData] = useState<ApiGetWorkEventGrouped | undefined>(
        undefined
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    console.log('lastDateRange', lastDateRange);
    const [dateRange, setDateRange] = useState<[Date, Date]>(
        // if last update was more than 2 hours ago, reset to last 7 days
        new Date(lastDateRange.updated).getTime() + 1000 * 60 * 60 * 2 < new Date().getTime()
            ? [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()]
            : [new Date(lastDateRange.since), new Date(lastDateRange.until)]
    );
    const [editorDateRange, setEditorDateRange] = useState<[Date, Date]>(dateRange);

    const {
        data: workEventsData,
        isLoading: workEventsLoading,
        error: workEventsError,
        isFetching: workEventsFetching,
        refetch: refetchWorkEvents,
    } = useQuery({
        queryKey: ['work-events-grouped', workerId, dateRange],
        queryFn: async () => {
            if (!workerId) {
                throw new Error('Worker ID is required');
            }
            return getApiWorkEventsGrouped(
                workerId,
                dateRange[0].toISOString(),
                dateRange[1].toISOString()
            );
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    const changeDateRange = (newDateRange: [Date, Date]) => {
        setDateRange(newDateRange);
        setLastDateRange({
            updated: new Date().toISOString(),
            since: newDateRange[0].toISOString(),
            until: newDateRange[1].toISOString(),
        });
        refetchWorkEvents();
    };

    const createEvent = async (data: ApiCreateWorkEvent) => {
        if (!workerId) {
            throw new Error('Worker ID is required');
        }
    };

    const removeEvent = async (id: string) => {
        await updateApiWorkEvent(id, { isDeleted: true });
        setEditorEventData(
            editorEventData
                ? {
                      ...editorEventData,
                      workEvents: editorEventData.workEvents.filter((e) => e.id !== id),
                  }
                : undefined
        );

        refetchWorkEvents();
    };

    if (!workerId) {
        throw new Error('Worker ID is required');
    }

    return (
        <WorkEventsContext.Provider
            value={{
                isProcessing: workEventsLoading || workEventsFetching || isProcessing,
                eventsGrouped: workEventsData?.data,
                dateRange,
                editorEvents: editorEventData,
                changeDateRange,
                removeEvent: removeEvent,
                createEvent: createEvent,
            }}
        >
            <WorkDayEditor open={isEditorOpen} onOpenChange={setIsEditorOpen} />
            <Container pb={20} display={'flex'} flexDirection={'column'} gap={4}>
                <WorkerHero workerId={workerId} />
                {workerId && (
                    <WorkDayTable
                        disabled={workEventsLoading || workEventsFetching}
                        onEdit={(data) => {
                            setEditorEventData(undefined);
                            setIsEditorOpen(true);
                        }}
                        empty={!workEventsData?.data?.length}
                    >
                        {workEventsData?.data &&
                            workEventsData.data.map((data) => (
                                <WorkDayTableRow
                                    key={data.sinceDate}
                                    data={data}
                                    onClick={() => {
                                        setEditorEventData(data);
                                        setEditorDateRange([
                                            new Date(data.sinceDate),
                                            new Date(data.untilDate),
                                        ]);
                                        setIsEditorOpen(true);
                                    }}
                                />
                            ))}
                    </WorkDayTable>
                )}
            </Container>
        </WorkEventsContext.Provider>
    );
};

export default WorkerPage;
