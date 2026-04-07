import type { ApiWorkDay, ApiWorkEvent } from '@shared/api-work-events';
import { secondsToString } from '@src/utils/seconds-to-string';
import { useState, type FC } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import styles from './work-report.module.scss';
import { Timeline } from '@src/components/timeline';
import { BsPlus } from 'react-icons/bs';
import { dateToString } from '@src/utils/date-to-string';
import { dateToStringHours } from '@src/utils/date-to-string-hours';

const WorkReportItem: FC<{ day: ApiWorkDay; onEdit?: (event?: ApiWorkEvent, defaultData?: Date) => void }> = ({
    day,
    onEdit,
}) => {
    const [hoveredEventId, setHoveredEventId] = useState<string | undefined>(undefined);

    return (
        <ListGroup.Item className={styles.workReportItem}>
            <div className={styles.workReportItemHeader}>
                <div>
                    <h6>{dateToString(new Date(day.dayEnd))}</h6>
                    <p>{secondsToString(day.seconds)} h</p>
                </div>
                <Timeline
                    start={new Date(day.dayStart)}
                    end={new Date(day.dayEnd)}
                    events={day.events.map((e) => {
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
            <div className={styles.workReportItemListWrapper}>
                <div>
                    {day.events.length > 0 && (
                        <ListGroup>
                            <ListGroup.Item className={styles.workReportItemListHeader}>
                                <p>Time</p>
                                <p>Start Place</p>
                                <p>End Place</p>
                            </ListGroup.Item>
                            {day.events.map((e) => (
                                <ListGroup.Item
                                    className={styles.workReportItemListItem}
                                    action={!!onEdit}
                                    key={e.id}
                                    onMouseEnter={() => setHoveredEventId(e.id)}
                                    onMouseLeave={() => setHoveredEventId(undefined)}
                                    onClick={() => onEdit?.(e)}
                                >
                                    <p>{dateToStringHours([new Date(e.timeStart), new Date(e.timeEnd)])}</p>
                                    <p>{e.placeStart || '---'}</p>
                                    <p>{e.placeEnd || '---'}</p>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    {onEdit && (
                        <Button variant="outline" onClick={() => onEdit(undefined, new Date(day.dayEnd))}>
                            <BsPlus size={30} />
                        </Button>
                    )}
                </div>
            </div>
        </ListGroup.Item>
    );
};

export default WorkReportItem;
