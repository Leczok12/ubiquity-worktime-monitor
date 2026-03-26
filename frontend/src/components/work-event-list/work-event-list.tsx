import type { FC, PropsWithChildren } from 'react';
import { ListGroup } from 'react-bootstrap';
import styles from './work-event-list.module.scss';

const WorkEventList: FC<PropsWithChildren> = ({ children }) => {
    if (!children || (Array.isArray(children) && children.length === 0)) {
        return null;
    }

    return (
        <ListGroup>
            <ListGroup.Item className={styles.workEventListHeader}>
                <p>Time</p>
                <p>Start Place</p>
                <p>End Place</p>
                <p>Actions</p>
            </ListGroup.Item>
            {children}
        </ListGroup>
    );
};

export default WorkEventList;
