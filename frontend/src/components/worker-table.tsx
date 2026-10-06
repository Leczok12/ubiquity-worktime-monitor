import { type FC } from 'react';
import { Card, Text, useBreakpointValue } from '@chakra-ui/react';
import type { ApiGetWorker } from '@shared/types/api/api-worker';
import Alert from './alert';
import MultipleLineSkeleton from './multiple-line-skeleton';

const BreakPoints = {
    base: 'small',
    sm: 'normal',
    md: 'normal',
    lg: 'normal',
    xl: 'normal',
};

export const WorkerTable: FC<{
    loading?: boolean;
    error?: string;
    data?: ApiGetWorker[];
    onClick: (id: string) => void;
}> = ({ loading, error, data, onClick }) => {
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
                                        gridTemplateColumns={'1fr 1fr'}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        textAlign={'center'}
                                    >
                                        <strong>Name</strong>
                                        <strong>Email</strong>
                                    </Card.Body>
                                </Card.Root>
                            )}
                            {data?.map((worker) => (
                                <WorkerTableRow
                                    onClick={() => onClick(worker.id)}
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

export const WorkerTableRow: FC<{ data: ApiGetWorker; isSmall?: boolean; onClick: () => void }> = ({
    data,
    isSmall = false,
    onClick,
}) => {
    return (
        <Card.Root
            borderColor={data.active ? undefined : 'fg.error'}
            _hover={{ bg: 'bg.muted' }}
            transition="background-color 0.1s ease-in-out"
            onClick={onClick}
            cursor="pointer"
        >
            <Card.Body
                display="grid"
                p={2}
                gridTemplateColumns={isSmall ? '1fr' : '1fr 1fr'}
                gap={isSmall ? 2 : 0}
                justifyContent="space-evenly"
                alignItems="center"
                textAlign={'center'}
            >
                <Text truncate>
                    {data.lastname} {data.name}
                </Text>
                <Text truncate>
                    {data.email === undefined || data.email === '' ? '---@---.--' : data.email}
                </Text>
            </Card.Body>
        </Card.Root>
    );
};
