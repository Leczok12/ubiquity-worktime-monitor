import { type FC } from 'react';
import { Card, useBreakpointValue, Text } from '@chakra-ui/react';
import { deviceTypes, type ApiGetDevice, type ApiUpdateDevice } from '@shared/types/api/api-device';
import Alert from './alert';
import MultipleLineSkeleton from './multiple-line-skeleton';
import Select from './select';

const BreakPoints = {
    base: 'small',
    sm: 'small',
    md: 'small',
    lg: 'normal',
    xl: 'normal',
};

export const AdminDeviceTable: FC<{
    loading?: boolean;
    error?: string;
    data?: ApiGetDevice[];
    disabled?: boolean;
    onEdit: (id: string, data: ApiUpdateDevice) => void;
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
                                        gridTemplateColumns={'1fr 1fr 1fr'}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        textAlign={'center'}
                                    >
                                        <strong>ID</strong>
                                        <strong>Name</strong>
                                        <strong>Type</strong>
                                    </Card.Body>
                                </Card.Root>
                            )}
                            {data?.map((device) => (
                                <AdminDeviceTableRow
                                    key={device.id}
                                    data={device}
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

const AdminDeviceTableRow: FC<{
    data: ApiGetDevice;
    isSmall?: boolean;
    disabled?: boolean;
    onEdit: (id: string, data: ApiGetDevice) => void;
}> = ({ data, isSmall, disabled, onEdit }) => {
    return (
        <Card.Root>
            <Card.Body
                display="grid"
                gridTemplateColumns={isSmall ? '1fr' : '1fr 1fr 1fr'}
                gap={isSmall ? 2 : 0}
                justifyContent="space-evenly"
                alignItems="center"
                textAlign={'center'}
            >
                <Text truncate>{data.id}</Text>
                <Text truncate>{data.name}</Text>
                <Select
                    disabled={disabled}
                    size="sm"
                    w={'100%'}
                    placeholder="Select type"
                    items={deviceTypes.map((type) => ({ value: type, label: type }))}
                    value={[data.type]}
                    onValueChange={(value) => {
                        onEdit(data.id, { ...data, type: value.value[0] as ApiGetDevice['type'] });
                    }}
                ></Select>
            </Card.Body>
        </Card.Root>
    );
};
