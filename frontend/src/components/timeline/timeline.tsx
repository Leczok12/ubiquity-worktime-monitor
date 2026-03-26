import type { FC } from 'react';
import styles from './timeline.module.scss';
import type { TimelineEvent } from './timeline-types';

const Timeline: FC<{ start: Date; end: Date; events: TimelineEvent[]; activeIds?: string[] }> = ({
    start,
    end,
    events,
    activeIds = [],
}) => {
    return (
        <div className={styles.timeline}>
            {events.map((event, i) => {
                const pStart =
                    ((event.timeStart.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
                const pSize = Math.max(
                    ((event.timeEnd.getTime() - event.timeStart.getTime()) / (end.getTime() - start.getTime())) * 100,
                    1
                );

                return (
                    <div
                        key={event.id}
                        className={`${styles.timelineBar} ${activeIds.includes(event.id) ? styles.timelineBarActive : ''}`}
                        style={{
                            zIndex: Math.floor(100.0 - pSize),
                            top: `${i * -10}px`,
                            width: `${pSize}%`,
                            left: `${pStart}%`,
                            backgroundColor: event.color,
                        }}
                    ></div>
                );
            })}
        </div>
    );
};

export default Timeline;
