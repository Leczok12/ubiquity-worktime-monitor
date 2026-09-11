import { Button, Card, Heading, IconButton, Input } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa6';
import { getApiAuthConfig, loginLocalApiAuthUser } from '@src/api/api-auth';
import { useNavigate } from 'react-router';
import LoginForm from '@src/forms/login-form';
import Alert from '@src/components/alert';

const AuthLoginPage = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | undefined>(undefined);
    const [isDisabled, setIsDisabled] = useState(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ['auth', 'config'],
        queryFn: getApiAuthConfig,
        retry: false,
        staleTime: 0,
        gcTime: 0,
    });

    if (!data || isLoading) {
        return null;
    }

    if (error) {
        return <Alert title="Error" status="error" description={error?.message} />;
    }

    return (
        <Card.Root w={'300px'}>
            <Card.Header>
                <Heading textAlign="center" size="xl" mb={6}>
                    Login
                </Heading>
            </Card.Header>
            <Card.Body display="flex" flexDirection="column" gap={4}>
                {loginError && <Alert status="error" description={loginError} />}
                <LoginForm
                    disabled={isDisabled}
                    onSubmit={async (data) => {
                        setIsDisabled(true);
                        loginLocalApiAuthUser(data)
                            .catch((error) => {
                                console.error('Error during login:', error);
                                setLoginError(error.message);
                            })
                            .then(() => {
                                navigate('../../'); //TODO: fix it
                            })
                            .finally(() => {
                                setIsDisabled(false);
                            });
                    }}
                    onError={(error) => {
                        setLoginError(error);
                    }}
                />
                {data.data?.microsoft?.enabled || data.data?.google?.enabled ? <hr /> : null}
                {data.data?.microsoft?.enabled && (
                    <IconButton
                        variant="subtle"
                        aria-label="User"
                        disabled={isDisabled}
                        onClick={() => navigate('/api/auth/microsoft/?redirect=/')}
                    >
                        <FaMicrosoft /> {data.data?.microsoft?.loginLabel}
                    </IconButton>
                )}
                {data.data?.google?.enabled && (
                    <IconButton
                        variant="subtle"
                        aria-label="User"
                        disabled={isDisabled}
                        onClick={() => navigate('/api/auth/google/?redirect=/')}
                    >
                        <FaGoogle /> {data.data?.google?.loginLabel}
                    </IconButton>
                )}
            </Card.Body>
        </Card.Root>
    );
};

export default AuthLoginPage;
