import { type FC } from 'react';
import { Card, useBreakpointValue, Text, Button } from '@chakra-ui/react';
import type { ApiGetGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import Alert from './alert';
import MultipleLineSkeleton from './multiple-line-skeleton';

const BreakPoints = {
    base: 'small',
    sm: 'small',
    md: 'small',
    lg: 'normal',
    xl: 'normal',
};

export const AdminGroupTable: FC<{
    loading?: boolean;
    error?: string;
    data?: ApiGetGroup[];
    disabled?: boolean;
    onEdit: (id: string, data: ApiUpdateGroup) => void;
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
                                        gridTemplateColumns={'2fr 2fr 0.5fr'}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        textAlign={'center'}
                                    >
                                        <strong>ID</strong>
                                        <strong>Name</strong>
                                    </Card.Body>
                                </Card.Root>
                            )}
                            {data?.map((group) => (
                                <AdminGroupTableRow
                                    key={group.id}
                                    data={group}
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

const AdminGroupTableRow: FC<{
    data: ApiGetGroup;
    isSmall: boolean;
    disabled?: boolean;
    onEdit: (id: string, data: ApiUpdateGroup) => void;
}> = ({ data, isSmall, disabled, onEdit }) => {
    return (
        <Card.Root>
            <Card.Body
                display="grid"
                gridTemplateColumns={isSmall ? '1fr' : '2fr 2fr 0.5fr'}
                gap={isSmall ? 2 : 0}
                justifyContent="space-evenly"
                alignItems="center"
                textAlign={'center'}
            >
                <Text truncate>{data.id}</Text>
                <Text truncate>{data.name}</Text>
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
