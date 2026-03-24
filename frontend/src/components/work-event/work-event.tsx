import type { ApiWorkEvent } from '@shared/api-work-events';
import { type FC } from 'react';
import { ListGroup } from 'react-bootstrap';
import styles from './work-event.module.scss';

const WorkEvent: FC<{ event: ApiWorkEvent }> = ({ event }) => {
    console.log(event);

    const startDate = new Date(event.events[0]?.timeStart).toLocaleDateString();
    const endDate = new Date(event.events[event.events.length - 1]?.timeEnd).toLocaleDateString();
    const date = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
    const time = 0;

    return (
        <ListGroup.Item className={styles.workEvent}>
            <div>
                <p>{date}</p>
                <p>{new Date(time).toLocaleTimeString()}</p>
                <div
                    style={{
                        height: '10px',
                        width: '100%',
                        backgroundColor: 'blue',
                        margin: '10px 0px',
                        borderRadius: '5px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            top: '0px',
                            height: '10px',
                            width: '50%',
                            left: '25%',
                            backgroundColor: 'red',
                        }}
                    ></div>
                    <div
                        style={{
                            position: 'relative',
                            top: '-10px',
                            height: '10px',
                            width: '25%',
                            left: '5%',
                            backgroundColor: 'yellow',
                        }}
                    ></div>
                    <div
                        style={{
                            position: 'relative',
                            top: '-20px',
                            height: '10px',
                            width: '50%',
                            left: '75%',
                            backgroundColor: 'purple',
                        }}
                    ></div>
                </div>
            </div>
            <div>
                {event.events.map((e) => (
                    <div key={e.id} className={styles.workEventEntry}>
                        <p>{e.type}</p>
                        <p>{new Date(e.timeStart).toLocaleTimeString()}</p>
                        <p>{e.placeStart}</p>
                        <p>{new Date(e.timeEnd).toLocaleTimeString()}</p>
                        <p>{e.placeEnd}</p>
                    </div>
                ))}
            </div>
        </ListGroup.Item>
    );
};

export default WorkEvent;
