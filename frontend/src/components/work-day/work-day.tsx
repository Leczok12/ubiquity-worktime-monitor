import type { ApiWorkDay } from '@shared/api-work-events';
import { type FC } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import styles from './work-day.module.scss';

const WorkDay: FC<{ day: ApiWorkDay }> = ({ day }) => {
    return (
        <ListGroup.Item className={styles.workDay}>
            <div className={styles.workDayHeader}>
                <div>
                    <h6>{new Date(day.dayEnd).toLocaleDateString()}</h6>
                    <p>{new Date(day.seconds * 1000).toISOString().slice(11, 16)} h</p>
                </div>
                <div className={styles.workDayVisualization}>
                    {day.events.map((e, i) => (
                        <>
                            <div
                                key={i}
                                style={{
                                    zIndex: e.type === 'BREAK' ? 100 : 99,
                                    top: `${i * -10}px`,
                                    width: `${Math.max(((new Date(e.timeEnd).getTime() - new Date(e.timeStart).getTime()) / (new Date(day.dayEnd).getTime() - new Date(day.dayStart).getTime())) * 100, 1)}%`,
                                    left: `${((new Date(e.timeStart).getTime() - new Date(day.dayStart).getTime()) / (new Date(day.dayEnd).getTime() - new Date(day.dayStart).getTime())) * 100}%`,
                                    backgroundColor: e.type === 'WORK' ? 'var(--bs-primary)' : 'var(--bs-warning)',
                                }}
                            ></div>
                        </>
                    ))}
                </div>
            </div>
            {day.events.length > 0 && (
                <div className={styles.workDayDetailsWrapper}>
                    <ListGroup className={styles.workDayDetails}>
                        <ListGroup.Item className={styles.workEventEntry}>
                            <p>Start Time</p>
                            <p>Start Place</p>
                            <p>End Time</p>
                            <p>End Place</p>
                            <p>Actions</p>
                        </ListGroup.Item>
                        {day.events.map((e) => (
                            <ListGroup.Item key={e.id} className={styles.workEventEntry}>
                                {/* <p>{e.type}</p> */}
                                <p>{new Date(e.timeStart).toLocaleTimeString()}</p>
                                <p>{e.placeStart}</p>
                                <p>{new Date(e.timeEnd).toLocaleTimeString()}</p>
                                <p>{e.placeEnd}</p>
                                <div>
                                    <Button onClick={() => navigator.clipboard.writeText(e.id)}>Copy ID</Button>
                                    <Button onClick={() => navigator.clipboard.writeText(e.id)}>Copy ID</Button>
                                    <Button onClick={() => navigator.clipboard.writeText(e.id)}>Copy ID</Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </ListGroup.Item>
    );
};

export default WorkDay;
