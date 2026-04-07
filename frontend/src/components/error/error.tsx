import styles from './error.module.scss';
import { SplashScreen } from '../splash-screen';
import type { FC } from 'react';
import { Alert } from 'react-bootstrap';

const Error: FC<{ compact?: boolean; message: string }> = ({ compact = false, message }) => {
    const ErrorContent = (
        <Alert variant={'danger'} className={`${styles.error} ${compact ? styles.compactError : ''}`}>
            <h1>Error</h1>
            <p>Message: {message}</p>
        </Alert>
    );

    if (compact) return ErrorContent;

    return <SplashScreen>{ErrorContent}</SplashScreen>;
};

export default Error;
