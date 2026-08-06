import { Alert, Button, Card, Heading } from '@chakra-ui/react';
import { useState } from 'react';
import { logoutApiAuthUser } from '@src/api/api-auth';
import { useNavigate } from 'react-router';

const AuthLogoutPage = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | undefined>(undefined);

    return (
        <Card.Root w={'300px'}>
            <Card.Header textAlign="center">
                <Heading size="xl">Are you sure you want to logout?</Heading>
            </Card.Header>
            <Card.Body
                display="flex"
                flexDirection="column"
                gap={4}
                as="form"
                onSubmit={(e) => {
                    setLoginError(undefined);
                    logoutApiAuthUser()
                        .then(() => {
                            navigate('/auth/login');
                        })
                        .catch((err) => {
                            setLoginError(err.message);
                        });
                    e.preventDefault();
                }}
            >
                {loginError && (
                    <Alert.Root variant="subtle" status="error">
                        <Alert.Description>{loginError}</Alert.Description>
                    </Alert.Root>
                )}
                <Button variant="subtle" type="submit">
                    Logout
                </Button>
            </Card.Body>
        </Card.Root>
    );
};

export default AuthLogoutPage;
