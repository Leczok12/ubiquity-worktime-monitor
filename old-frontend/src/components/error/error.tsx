import styles from './error.module.scss';
import { SplashScreen } from '../splash-screen';
import { useContext, type FC } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { BsArrowClockwise, BsCopy, BsHouseFill } from 'react-icons/bs';
import { UserContext } from '@src/hooks/use-user-context';

const Error: FC<{ compact?: boolean; message: string }> = ({ compact = false, message }) => {
    const user = useContext(UserContext);

    const ErrorContent = (
        <Alert variant={'danger'} className={`${styles.error} ${compact ? styles.compactError : ''}`}>
            <h1>Error</h1>
            <p>Message: {message}</p>
            <div>
                <Button variant={'danger'} onClick={() => (window.location.href = '/')}>
                    <BsHouseFill size={30} />
                </Button>
                <Button variant={'danger'} onClick={() => window.location.reload()}>
                    <BsArrowClockwise size={30} />
                </Button>
                <Button
                    variant={'danger'}
                    onClick={() =>
                        navigator.clipboard.writeText(
                            `Error: ${message}, URL: ${window.location.href}, User: { id: ${user?.id || 'Unknown'}, email: ${user?.email || 'Unknown'}, role: ${user?.role || 'Unknown'} }`
                        )
                    }
                >
                    <BsCopy size={30} />
                </Button>
            </div>
        </Alert>
    );

    if (compact) return ErrorContent;

    return <SplashScreen>{ErrorContent}</SplashScreen>;
};

export default Error;
