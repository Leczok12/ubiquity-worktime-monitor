import { useState, type FC } from 'react';
import { useBreakpointValue, Card, Text, Button } from '@chakra-ui/react';
import type { ApiGetWorker } from '@shared/types/api/api-worker';
import { updateApiWorker } from '@src/api/api-worker';
import Alert from './alert';
import MultipleLineSkeleton from './multiple-line-skeleton';

const BreakPoints = {
    base: 'small',
    sm: 'small',
    md: 'small',
    lg: 'normal',
    xl: 'normal',
};

export const AdminWorkerTable: FC<{
    loading?: boolean;
    error?: string;
    data?: ApiGetWorker[];
}> = ({ loading, error, data }) => {
    const currentBrakePoint = useBreakpointValue(BreakPoints);

    return (
        <Card.Root>
            <Card.Body display="flex" flexDirection="column" gap={3}>
                {(() => {
                    if (error) {
                        return <Alert status="error" title="Error" description={error} />;
                    }
                    if (loading) {
                        return <MultipleLineSkeleton lines={3} />;
                    }
                    if (data?.length === 0 || data === undefined) {
                        return <Alert status="info" title="Info" description="No workers found" />;
                    }

                    return (
                        <>
                            {currentBrakePoint === 'normal' && (
                                <Card.Root>
                                    <Card.Body
                                        pt={2}
                                        pb={2}
                                        display="grid"
                                        gridTemplateColumns={'2fr 1fr 2fr 0.5fr'}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        textAlign={'center'}
                                    >
                                        <strong>ID</strong>
                                        <strong>Name</strong>
                                        <strong>Email</strong>
                                    </Card.Body>
                                </Card.Root>
                            )}
                            {data?.map((worker) => (
                                <AdminWorkerTableRow
                                    key={worker.id}
                                    data={worker}
                                    isSmall={currentBrakePoint === 'small'}
                                />
                            ))}
                        </>
                    );
                })()}
            </Card.Body>
        </Card.Root>
    );
};

const AdminWorkerTableRow: FC<{
    data: ApiGetWorker;
    isSmall?: boolean;
}> = ({ data, isSmall = false }) => {
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [show, setShow] = useState(data.show);

    const onCheckedChange = (checked: boolean) => {
        setDisabled(true);
        updateApiWorker(data.id, { show: checked })
            .then(() => {
                setDisabled(false);
                setShow(checked);
            })
            .catch((err) => {
                setError(err.message);
                setDisabled(false);
            });
    };

    if (error) {
        return <Alert status="error" title={`Error ${data.id}`} description={error} />;
    }
    return (
        <Card.Root>
            <Card.Body
                display="grid"
                gridTemplateColumns={isSmall ? '1fr' : '2fr 1fr 2fr 0.5fr'}
                gap={isSmall ? 2 : 0}
                justifyContent="space-evenly"
                alignItems="center"
                textAlign={'center'}
            >
                <Text truncate>{data.id}</Text>
                <Text truncate>
                    {data.name} {data.lastname}
                </Text>
                <Text truncate>{!data.email || data.email === '' ? '---@---.--' : data.email}</Text>
                <Button
                    size="sm"
                    w={isSmall ? '100%' : undefined}
                    onClick={() => onCheckedChange(!show)}
                    disabled={disabled}
                    variant={show ? 'solid' : 'outline'}
                >
                    {show ? 'Hide' : 'Show'}
                </Button>
            </Card.Body>
        </Card.Root>
    );
};
