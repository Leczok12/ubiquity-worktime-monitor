import type { FC } from 'react';
import { ListGroup, type ListGroupProps } from 'react-bootstrap';
import styles from './work-event-list.module.scss';
import type { WorkEventListEvent } from './work-event-list-types';

const WorkEventListItem: FC<{ event: WorkEventListEvent; onClick: () => void } & ListGroupProps> = ({
    event,
    onClick,
    ...props
}) => {
    return (
        <ListGroup.Item className={styles.workEventListItem} {...props} onClick={onClick}>
            <p>
                {event.timeStart.toLocaleTimeString().slice(0, 5)} - {event.timeEnd.toLocaleTimeString().slice(0, 5)}
            </p>
            <p>{event.placeStart}</p>
            <p>{event.placeEnd}</p>
        </ListGroup.Item>
    );
};

export default WorkEventListItem;
