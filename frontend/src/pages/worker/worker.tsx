import { Loader } from '@src/components/loader';
import { useWorker } from '@src/hooks/use-worker';
import { Container, ListGroup, Toast, ToastContainer } from 'react-bootstrap';
import { useParams } from 'react-router';
import styles from './worker.module.scss';
import { WorkerHero } from '@src/components/worker-hero';
import { useWorkEvents } from '@src/hooks/use-work-events';
import { WorkDaySearchBar } from '@src/components/work-day-search-bar';
import { useState } from 'react';
import { WorkDay } from '@src/organisms/work-day';
import { WorkEventEditor } from '@src/components/work-event-editor';
import type { ApiWorkEvent } from '@shared/api-work-events';

const WorkerPage = () => {
    const { workerId } = useParams<{ workerId: string }>();

    const [showEventEditor, setShowEventEditor] = useState(false);
    const [dataEventEditor, setDataEventEditor] = useState<undefined | ApiWorkEvent>(undefined);

    const [searchRange, setSearchRange] = useState<{ since: Date; until: Date }>({
        since: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        until: new Date(),
    });

    const { data: workerData, isLoading: isWorkerLoading } = useWorker({ workerId: workerId ?? '' });

    const {
        data: workEventsData,
        isLoading: isWorkEventsLoading,
        refetch: refetchWorkEvents,
    } = useWorkEvents(workerId ?? '', searchRange.since, searchRange.until);

    if (isWorkerLoading || workerData?.data === undefined) {
        return <Loader />;
    }
    return (
        <Container className={styles.worker}>
            <WorkEventEditor
                show={showEventEditor}
                data={dataEventEditor}
                workerId={workerData.data.id}
                onSuccess={async () => {
                    await refetchWorkEvents();
                }}
                onHide={() => {
                    setShowEventEditor(false);
                }}
            />

            <WorkerHero worker={workerData?.data} />
            <WorkDaySearchBar disabled={isWorkEventsLoading} onSearch={setSearchRange} defaultRange={searchRange} />

            {isWorkEventsLoading ? (
                <Loader compact />
            ) : (
                <ListGroup>
                    {workEventsData?.days.map((day) => (
                        <WorkDay
                            key={day.dayStart}
                            day={day}
                            onEdit={(event) => {
                                setDataEventEditor(event);
                                setShowEventEditor(true);
                            }}
                        />
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default WorkerPage;
