import { useState, type FC, type PropsWithChildren } from 'react';
import { Alert, Skeleton, Select, Portal, Table, createListCollection } from '@chakra-ui/react';
import { deviceTypes, type ApiGetDevice, type DeviceType } from '@shared/types/api/api-device';
import { updateApiDevice } from '@src/api/api-device';

export const AdminDeviceTable: FC<
    PropsWithChildren & { loading?: boolean; error?: string; empty?: boolean }
> = ({ children, loading, error, empty }) => {
    return (
        <Table.Root interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end" width="150px">
                        Type
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {loading && (
                    <Table.Row>
                        <Table.Cell colSpan={3}>
                            <Skeleton>Loading</Skeleton>
                        </Table.Cell>
                    </Table.Row>
                )}
                {error && (
                    <Table.Row>
                        <Table.Cell colSpan={3}>
                            <Alert.Root variant="subtle" status="error">
                                <Alert.Title>Error</Alert.Title>
                                <Alert.Description>{error}</Alert.Description>
                            </Alert.Root>
                        </Table.Cell>
                    </Table.Row>
                )}
                {empty && (
                    <Table.Row>
                        <Table.Cell colSpan={3}>
                            <Alert.Root variant="subtle" status="info">
                                <Alert.Title>Info</Alert.Title>
                                <Alert.Description>No devices found</Alert.Description>
                            </Alert.Root>
                        </Table.Cell>
                    </Table.Row>
                )}
                {loading || error || empty ? null : children}
            </Table.Body>
        </Table.Root>
    );
};

export const AdminDeviceTableRow: FC<{ data: ApiGetDevice }> = ({ data }) => {
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const types = createListCollection({
        items: deviceTypes.map((type) => ({ value: type, label: type })),
    });

    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={3}>
                    <Alert.Root variant="subtle" status="error">
                        <Alert.Title>Error</Alert.Title>
                        <Alert.Description>{error}</Alert.Description>
                    </Alert.Root>
                </Table.Cell>
            </Table.Row>
        );
    }

    return (
        <Table.Row key={data.id}>
            <Table.Cell>{data.id}</Table.Cell>
            <Table.Cell>{data.name}</Table.Cell>
            <Table.Cell textAlign="end">
                <Select.Root
                    collection={types}
                    defaultValue={[data.type]}
                    size="sm"
                    width="150px"
                    disabled={disabled}
                    onValueChange={(value) => {
                        setDisabled(true);
                        updateApiDevice(data.id, { type: value.value[0] as unknown as DeviceType })
                            .then(() => {
                                setDisabled(false);
                            })
                            .catch((err) => {
                                setError(err.message);
                                setDisabled(false);
                            });
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select device type" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {types.items.map((type) => (
                                    <Select.Item item={type} key={type.value}>
                                        {type.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Table.Cell>
        </Table.Row>
    );
};
