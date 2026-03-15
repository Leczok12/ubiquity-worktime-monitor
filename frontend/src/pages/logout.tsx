import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useAuthLogout } from '@src/hooks/use-auth-logout';

const LogoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout, isError, error } = useAuthLogout(() => {
        navigate('/auth/login', { replace: true });
    });

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
            <Card.Header>
                <h1>Logout</h1>
            </Card.Header>
            <Card.Body>
                {isError && (
                    <div className="alert alert-danger" role="alert">
                        {error?.message}
                    </div>
                )}

                <Button variant="primary" disabled={isError} className="mt-4" onClick={logout}>
                    Logout
                </Button>
            </Card.Body>
        </Card>
    );
};

export default LogoutPage;
