import { type FC } from 'react';
import { Card, useBreakpointValue, Text } from '@chakra-ui/react';
import type { ApiConfigElement } from '@shared/types/api/api-config';
import Alert from './alert';
import MultipleLineSkeleton from './multiple-line-skeleton';

const BreakPoints = {
    base: 'small',
    sm: 'small',
    md: 'normal',
    lg: 'normal',
    xl: 'normal',
};

export const AdminConfigurationTable: FC<{
    loading?: boolean;
    error?: string;
    data?: ApiConfigElement[];
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
                                        gridTemplateColumns={'1fr 1fr'}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        textAlign={'center'}
                                    >
                                        <strong>Name</strong>
                                        <strong>Value</strong>
                                    </Card.Body>
                                </Card.Root>
                            )}
                            {data?.map((config) => (
                                <AdminConfigurationTableRow
                                    key={config.name}
                                    data={config}
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

export const AdminConfigurationTableRow: FC<{ data: ApiConfigElement; isSmall: boolean }> = ({
    data,
    isSmall,
}) => {
    return (
        <Card.Root>
            <Card.Body
                display="grid"
                gridTemplateColumns={isSmall ? '1fr' : '1fr 1fr'}
                gap={isSmall ? 2 : 0}
                justifyContent="space-evenly"
                alignItems="center"
                textAlign={'center'}
            >
                <Text truncate style={{ fontWeight: 'bold' }}>
                    {data.name}
                </Text>
                <Text truncate>{data.value}</Text>
            </Card.Body>
        </Card.Root>
    );
};
