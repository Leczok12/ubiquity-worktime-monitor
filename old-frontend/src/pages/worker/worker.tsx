import { Loader } from '@src/components/loader';
import { useWorker } from '@src/hooks/use-worker';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router';
import styles from './worker.module.scss';
import { WorkerHero } from '@src/components/worker-hero';
import { useWorkEvents } from '@src/hooks/use-work-events';
import { WorkDaySearchBar } from '@src/components/work-day-search-bar';
import { useState } from 'react';
import { WorkEventEditor } from '@src/components/work-event-editor';
import type { ApiWorkEvent } from '@shared/api-work-events';
import { Error } from '@src/components/error';
import { WorkReport } from '@src/components/work-report';

const WorkerPage = () => {
    const { workerId } = useParams<{ workerId: string }>();

    const [showEventEditor, setShowEventEditor] = useState(false);
    const [eventEventEditor, setEventEventEditor] = useState<ApiWorkEvent | undefined>(undefined);
    const [defaultDateEventEditor, setDefaultDateEventEditor] = useState<Date | undefined>(undefined);

    const [searchRange, setSearchRange] = useState<{ since: Date; until: Date }>({
        since: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        until: new Date(),
    });

    const {
        data: workerData,
        isLoading: isWorkerLoading,
        error: workerError,
        isError: isWorkerError,
    } = useWorker(workerId ?? '');
    const {
        data: workEventsData,
        isLoading: isWorkEventsLoading,
        error: workEventsError,
        isError: isWorkEventsError,
        refetch: refetchWorkEvents,
    } = useWorkEvents(workerId ?? '', searchRange.since, searchRange.until);

    if (isWorkerError || workerError) {
        return <Error message={workerError?.message || 'An error occurred while fetching worker data.'} />;
    }

    if (isWorkerLoading || !workerData?.data) {
        return <Loader />;
    }

    return (
        <Container className={styles.worker}>
            <WorkEventEditor
                show={showEventEditor}
                data={eventEventEditor}
                defaultDate={defaultDateEventEditor}
                workerId={workerId}
                onSuccess={async () => {
                    await refetchWorkEvents();
                }}
                onHide={() => {
                    setShowEventEditor(false);
                }}
            />

            <WorkerHero worker={workerData.data} />

            <WorkDaySearchBar disabled={isWorkEventsLoading} onSearch={setSearchRange} defaultRange={searchRange} />

            {(() => {
                if (isWorkEventsError || workEventsError) {
                    return (
                        <Error
                            message={workEventsError?.message || 'An error occurred while fetching work events.'}
                            compact
                        />
                    );
                }
                if (isWorkEventsLoading || !workEventsData) {
                    return <Loader compact />;
                }

                return (
                    <WorkReport
                        data={workEventsData}
                        onEdit={(event, defaultData) => {
                            setEventEventEditor(event);
                            setDefaultDateEventEditor(defaultData);
                            setShowEventEditor(true);
                        }}
                    />
                );
            })()}
        </Container>
    );
};

export default WorkerPage;
