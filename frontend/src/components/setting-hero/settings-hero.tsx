import type { FC } from 'react';
import { Card } from 'react-bootstrap';

const SettingsHero: FC<{ title: string }> = ({ title }) => {
    return (
        <Card>
            <Card.Body>
                <h2 style={{ textAlign: 'center' }}>{title}</h2>
            </Card.Body>
        </Card>
    );
};

export default SettingsHero;
