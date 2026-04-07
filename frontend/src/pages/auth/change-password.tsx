import { Alert, Card } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router';

import styles from './auth.module.scss';
import ChangePasswordForm from '@src/forms/change-password-form';
import { useState } from 'react';
import { apiAuthChangePassword } from '@src/api/api-auth-change-password';

const ChangePasswordPage = () => {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const navigator = useNavigate();
    const redirect = searchParams.get('redirect');

    return (
        <Card className={styles.authWrapper}>
            <Card.Header>
                <h1>Change Password</h1>
            </Card.Header>
            <Card.Body className={styles.auth}>
                {error ? (
                    <Alert variant="danger">{error.message}</Alert>
                ) : (
                    <Alert variant="primary">Please type new password</Alert>
                )}
                <ChangePasswordForm
                    disabled={isLoading}
                    onSubmit={(data) => {
                        setIsLoading(true);
                        apiAuthChangePassword({
                            password: data.password,
                            passwordConfirm: data.passwordConfirm,
                        })
                            .then(() => {
                                if (redirect) {
                                    navigator(redirect);
                                } else {
                                    navigator('/');
                                }
                            })
                            .catch((err) => setError(err))
                            .finally(() => setIsLoading(false));
                    }}
                />
            </Card.Body>
        </Card>
    );
};

export default ChangePasswordPage;
