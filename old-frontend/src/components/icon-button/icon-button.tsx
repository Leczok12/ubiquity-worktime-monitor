import { type ComponentProps, type FC, type PropsWithChildren, type ReactNode } from 'react';
import { Button } from 'react-bootstrap';
import styles from './icon-button.module.scss';

const IconButton: FC<
    PropsWithChildren<
        {
            icon: ReactNode;
        } & ComponentProps<typeof Button>
    >
> = ({ icon, onClick, children, ...buttonProps }) => {
    return (
        <Button className={styles.iconButton} variant="primary" onClick={onClick} {...buttonProps}>
            {icon}
            <div>{children}</div>
        </Button>
    );
};

export default IconButton;
