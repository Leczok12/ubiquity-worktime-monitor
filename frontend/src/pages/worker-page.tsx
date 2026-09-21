import { Container } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiWorker } from '@src/api/api-worker';
import { useParams } from 'react-router';
import WorkerHero from '@src/components/worker-hero';
import { WorkDayTable, WorkDayTableRow } from '@src/components/work-day-table';
import {
    createApiWorkEvent,
    getApiWorkEventsGrouped,
    updateApiWorkEvent,
} from '@src/api/api-work-events';
import type {
    ApiCreateWorkEvent,
    ApiGetWorkEvent,
    ApiGetWorkEventGrouped,
} from '@shared/types/api/api-work-event';
import { createContext, useState } from 'react';
import WorkDayEditor from '@src/organisms/work-day-editor';
import WorkEventCreator from '@src/organisms/work-event-creator';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';
import { useLocalStorage } from '@src/hooks/use-local-storage';
import Alert from '@src/components/alert';
import { BiError, BiUser } from 'react-icons/bi';

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

    const [isProcessing, setIsProcessing] = useState(false);
    const [dateRange, setDateRange] = useState<[Date, Date]>(
        new Date(lastDateRange.updated).getTime() + 1000 * 60 * 60 * 2 < new Date().getTime()
            ? [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()]
            : [new Date(lastDateRange.since), new Date(lastDateRange.until)]
    );

    const [isCretorOpen, setIsCreatorOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorIndex, setEditorIndex] = useState<number | undefined>(undefined);

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
        setIsProcessing(true);
        await createApiWorkEvent(workerId!, data).finally(() => {
            setIsProcessing(false);
        });
        await refetchWorkEvents();
    };

    const removeEvent = async (id: string) => {
        setIsProcessing(true);
        await updateApiWorkEvent(id, { isDeleted: true }).finally(() => {
            setIsProcessing(false);
        });
        await refetchWorkEvents();
    };

    if (!workerId) {
        throw new Error('Worker ID is required');
    }

    return (
        <WorkEventsContext.Provider
            value={{
                isProcessing: workEventsFetching || isProcessing,
                isLodaing: workEventsLoading,
                eventsGrouped: workEventsData?.data,
                dateRange,
                changeDateRange,
                removeEvent: removeEvent,
                createEvent: createEvent,
            }}
        >
            <WorkEventCreator open={isCretorOpen} onOpenChange={setIsCreatorOpen} />
            <WorkDayEditor index={editorIndex} open={isEditorOpen} onOpenChange={setIsEditorOpen} />
            <Container pb={20} display={'flex'} flexDirection={'column'} gap={4}>
                <WorkerHero workerId={workerId} />
                {workerId && (
                    <WorkDayTable
                        disabled={workEventsLoading || workEventsFetching}
                        onEdit={() => setIsCreatorOpen(true)}
                        loading={workEventsLoading}
                    >
                        {workEventsData?.data &&
                            workEventsData.data.map((data, index) => (
                                <WorkDayTableRow
                                    key={data.sinceDate}
                                    data={data}
                                    onClick={() => {
                                        setIsEditorOpen(true);
                                        setEditorIndex(index);
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
