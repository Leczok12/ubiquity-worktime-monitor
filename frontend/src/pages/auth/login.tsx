import { Card } from 'react-bootstrap';
import LoginLocalForm from '@src/forms/login-local-form';

const LoginPage: React.FC = () => {
    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
            <Card.Header>
                <h1>Login</h1>
            </Card.Header>
            <Card.Body>
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
                            .then((result) => console.log(result));
                    }}
                />
            </Card.Body>
        </Card>
    );
};

export default LoginPage;
