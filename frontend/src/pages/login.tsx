import { Button, Card } from 'react-bootstrap';
import LoginLocalForm from '@src/forms/login-local-form';
import { useAuthConfig } from '@src/hooks/use-auth-config';
import { useNavigate } from 'react-router';

const LoginPage: React.FC = () => {
    const { data, isLoading, isError, error } = useAuthConfig();
    const navigator = useNavigate();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
            <Card.Header>
                <h1>Login</h1>
            </Card.Header>
            <Card.Body>
                {data?.local.enabled && (
                    <LoginLocalForm
                        onSubmit={(data) => {
                            fetch('/api/auth/callback/local', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            })
                                .then((response) => response.json())
                                .then((result) => {
                                    console.log(result);
                                    navigator('/'); // Redirect to home page after successful login
                                });
                        }}
                    />
                )}
                {data?.microsoft.enabled && <Button>{data.microsoft.label}</Button>}
            </Card.Body>
        </Card>
    );
};

export default LoginPage;
