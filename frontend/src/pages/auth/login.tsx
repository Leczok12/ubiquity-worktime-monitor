import { Alert, Card, Spinner } from 'react-bootstrap';
import LoginLocalForm from '@src/forms/login-local-form';
import { useAuthConfig } from '@src/hooks/use-auth-config';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthLogin } from '@src/hooks/use-auth-login';

import styles from './auth.module.scss';
import { IconButton } from '@src/components/icon-button';
import { BsMicrosoft } from 'react-icons/bs';

const LoginPage = () => {
    const navigator = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const {
        data: configData,
        isLoading: isConfigLoading,
        isError: isConfigError,
        error: configError,
    } = useAuthConfig();
    const {
        loginLocal,
        isLoading: isLoginLoading,
        isError: isLoginError,
        error: loginError,
    } = useAuthLogin(() => {
        navigator(redirect || '/');
    });
    console.log('Login successful, navigating to:', redirect);

    if (isConfigError) {
        return <Alert variant="danger">{configError?.message}</Alert>;
    }

    if (isConfigLoading || !configData) {
        return <Spinner animation="border" />;
    }

    return (
        <Card className={styles.authWrapper}>
            <Card.Header>
                <h1>Login</h1>
            </Card.Header>
            <Card.Body className={styles.auth}>
                {isLoginError ? (
                    <Alert variant="danger">{loginError?.message}</Alert>
                ) : (
                    <Alert variant="primary">Please login to the system</Alert>
                )}

                {configData.local.enabled && (
                    <LoginLocalForm
                        onSubmit={(data) => {
                            loginLocal({ username: data.username, password: data.password });
                        }}
                        label={configData.local.label}
                        disabled={isLoginLoading}
                    />
                )}

                {configData.microsoft.enabled && (
                    <IconButton icon={<BsMicrosoft />} onClick={() => {}}>
                        {configData.microsoft.label}
                    </IconButton>
                )}
                {/* {isLoginError && <Alert variant="danger">{loginError?.message}</Alert>}
                {data?.local.enabled && (
                    <LoginLocalForm
                        onSubmit={(data) => {
                            loginLocal(data.username, data.password);
                        }}
                    />
                )}
                <Button disabled={isLoginLoading}>asdsad</Button> */}
            </Card.Body>
        </Card>
    );
};

export default LoginPage;
