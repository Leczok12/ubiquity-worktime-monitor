import { Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useAuthLogout } from '@src/hooks/use-auth-logout';

import styles from './auth.module.scss';
import { IconButton } from '@src/components/icon-button';
import { BsBoxArrowLeft } from 'react-icons/bs';

const LogoutPage = () => {
    const navigate = useNavigate();
    const { logout, isError, error } = useAuthLogout(() => {
        navigate('/auth/login', { replace: true });
    });

    return (
        <Card className={styles.authWrapper}>
            <Card.Header>
                <h1>Logout</h1>
            </Card.Header>
            <Card.Body className={styles.auth}>
                {isError ? (
                    <Alert variant="danger">{error?.message}</Alert>
                ) : (
                    <Alert variant="primary">Click to logout</Alert>
                )}

                <IconButton disabled={isError} onClick={logout} icon={<BsBoxArrowLeft />}>
                    Logout
                </IconButton>
            </Card.Body>
        </Card>
    );
};

export default LogoutPage;
