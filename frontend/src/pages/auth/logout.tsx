import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import type { ApiResponse } from '@shared/api-response';
import { useNavigate } from 'react-router';

const LogoutPage: React.FC = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/callback/logout', { method: 'POST' });

            const payload = (await response.json()) as ApiResponse<undefined>;

            if (!response.ok || payload.status !== 'SUCCESS') {
                throw new Error('Logout failed');
            }
            console.log('Logout successful');
            navigate('/auth/login', { replace: true });
        } catch {
            setError('Failed to logout');
        }
    };

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
            <Card.Header>
                <h1>Logout</h1>
            </Card.Header>
            <Card.Body>
                {error && <p className="text-danger">{error}</p>}
                <Button variant="primary" className="mt-4" onClick={handleLogout}>
                    Logout
                </Button>
            </Card.Body>
        </Card>
    );
};

export default LogoutPage;
