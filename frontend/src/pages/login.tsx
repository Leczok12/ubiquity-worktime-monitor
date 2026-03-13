import { Card, Form } from 'react-bootstrap';

const LoginPage: React.FC = () => {
    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
            <Card.Header>
                <h1>Login</h1>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>User name</Form.Label>
                        <Form.Control type="text" placeholder="" />
                        <Form.Label className="mt-3">Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                        <Form.Control type="submit" value="Login" className="mt-4 btn btn-primary" />
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default LoginPage;
