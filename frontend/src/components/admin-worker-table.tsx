import { type FC } from 'react';
import { useBreakpointValue, Card, Text, Button } from '@chakra-ui/react';
import type { ApiGetWorker, ApiUpdateWorker } from '@shared/types/api/api-worker';
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
    disabled?: boolean;
    onEdit: (id: string, data: ApiUpdateWorker) => void;
}> = ({ loading, error, data, disabled, onEdit }) => {
    const currentBrakePoint = useBreakpointValue(BreakPoints, { ssr: false });

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
                                    disabled={disabled}
                                    onEdit={onEdit}
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
    disabled?: boolean;
    onEdit: (id: string, data: ApiUpdateWorker) => void;
}> = ({ data, isSmall = false, disabled, onEdit }) => {
    return (
        <Card.Root
            borderColor={data.active ? undefined : 'fg.error'}
            _hover={{ bg: 'bg.muted' }}
            transition="background-color 0.1s ease-in-out"
        >
            <Card.Body
                display="grid"
                pb={2}
                pt={2}
                gridTemplateColumns={isSmall ? '1fr' : '2fr 1fr 2fr 0.5fr'}
                gap={isSmall ? 2 : 0}
                justifyContent="space-evenly"
                alignItems="center"
                textAlign={'center'}
            >
                <Text truncate>{data.id}</Text>
                <Text truncate>
                    {data.lastname} {data.name}
                </Text>
                <Text truncate>{!data.email || data.email === '' ? '---@---.--' : data.email}</Text>
                <Button
                    size="sm"
                    w={isSmall ? '100%' : undefined}
                    onClick={() => onEdit(data.id, { ...data, show: !data.show })}
                    disabled={disabled}
                    variant={data.show ? 'solid' : 'outline'}
                >
                    {data.show ? 'Hide' : 'Show'}
                </Button>
            </Card.Body>
        </Card.Root>
    );
};
