import type { FC } from 'react';
import { Button, ListGroup, type ListGroupProps } from 'react-bootstrap';
import styles from './work-event-list.module.scss';
import type { WorkEventListEvent } from './work-event-list-types';
import { BsCopy, BsPenFill, BsTrash, BsTrash2Fill } from 'react-icons/bs';

const WorkEventListItem: FC<
    { event: WorkEventListEvent; onDelete: () => void; onEdit: () => void } & ListGroupProps
> = ({ event, onDelete, onEdit, ...props }) => {
    return (
        <ListGroup.Item className={styles.workEventListItem} {...props}>
            <p>
                {event.timeStart.toLocaleTimeString().slice(0, 5)} - {event.timeEnd.toLocaleTimeString().slice(0, 5)}
            </p>
            <p>{event.placeStart}</p>
            <p>{event.placeEnd}</p>
            <div>
                <Button
                    variant="info"
                    onClick={() =>
                        navigator.clipboard.writeText(
                            `id: ${event.id}, timeStart: ${event.timeStart.toISOString()}, placeStart: ${event.placeStart}, timeEnd: ${event.timeEnd.toISOString()}, placeEnd: ${event.placeEnd}`
                        )
                    }
                >
                    <BsCopy />
                </Button>
                <Button variant="warning" onClick={onEdit}>
                    <BsPenFill />
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    <BsTrash />
                </Button>
            </div>
        </ListGroup.Item>
    );
};

export default WorkEventListItem;
