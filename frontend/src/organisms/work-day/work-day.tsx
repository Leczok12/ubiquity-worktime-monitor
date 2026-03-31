import type { ApiWorkDay, ApiWorkEvent } from '@shared/api-work-events';
import { useEffect, useMemo, useState, type FC } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import styles from './work-day.module.scss';
import { calculateWorkTime } from '@src/utils/calculate-work-time';
import { Timeline } from '@src/components/timeline';
import { WorkEventList, WorkEventListItem } from '@src/components/work-event-list';
import { BsPlus } from 'react-icons/bs';

const WorkDay: FC<{ day: ApiWorkDay; onEdit: (apiWorkEvent?: ApiWorkEvent) => void }> = ({ day, onEdit }) => {
    const [events, setEvents] = useState(day.events);
    const [hoveredEventId, setHoveredEventId] = useState<string | undefined>(undefined);
    const totalTime = useMemo(() => calculateWorkTime(events), [events]);

    useEffect(() => {
        setEvents(day.events);
    }, [day.events]);

    return (
        <ListGroup.Item className={styles.workDay}>
            <div className={styles.workDayHeader}>
                <div>
                    <h6>{new Date(day.dayEnd).toLocaleDateString()}</h6>
                    <p>{new Date(totalTime * 1000).toISOString().slice(11, 16)} h</p>
                </div>
                <Timeline
                    start={new Date(day.dayStart)}
                    end={new Date(day.dayEnd)}
                    events={events.map((e) => {
                        return {
                            color: e.type === 'WORK' ? 'var(--bs-primary)' : 'var(--bs-warning)',
                            id: e.id,
                            timeStart: new Date(e.timeStart),
                            timeEnd: new Date(e.timeEnd),
                        };
                    })}
                    activeIds={hoveredEventId ? [hoveredEventId] : []}
                />
            </div>
            <div className={styles.workEventListWrapper}>
                <div>
                    <WorkEventList>
                        {events.map((event) => (
                            <WorkEventListItem
                                key={event.id}
                                event={{
                                    id: event.id,
                                    timeStart: new Date(event.timeStart),
                                    placeStart: event.placeStart ?? '---',
                                    timeEnd: new Date(event.timeEnd),
                                    placeEnd: event.placeEnd ?? '---',
                                }}
                                onClick={() => onEdit(event)}
                                onMouseEnter={() => setHoveredEventId(event.id)}
                                onMouseLeave={() => setHoveredEventId(undefined)}
                            />
                        ))}
                    </WorkEventList>
                    <Button variant="outline" onClick={() => onEdit()}>
                        <BsPlus size={30} />
                    </Button>
                </div>
            </div>
        </ListGroup.Item>
    );
};

export default WorkDay;
