import { useState, type FC, type PropsWithChildren } from 'react';
import { Alert, Skeleton, Table, Switch } from '@chakra-ui/react';
import type { ApiGetWorker } from '@shared/types/api/api-worker';
import { updateApiWorker } from '@src/api/api-worker';

export const AdminWorkerTable: FC<
    PropsWithChildren & { loading?: boolean; error?: string; empty?: boolean }
> = ({ children, loading, error, empty }) => {
    return (
        <Table.Root interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Name and Last Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Email</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Show</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {loading && (
                    <Table.Row>
                        <Table.Cell colSpan={4}>
                            <Skeleton>Loading</Skeleton>
                        </Table.Cell>
                    </Table.Row>
                )}
                {error && (
                    <Table.Row>
                        <Table.Cell colSpan={4}>
                            <Alert.Root variant="subtle" status="error">
                                <Alert.Title>Error</Alert.Title>
                                <Alert.Description>{error}</Alert.Description>
                            </Alert.Root>
                        </Table.Cell>
                    </Table.Row>
                )}
                {empty && (
                    <Table.Row>
                        <Table.Cell colSpan={4}>
                            <Alert.Root variant="subtle" status="info">
                                <Alert.Title>Info</Alert.Title>
                                <Alert.Description>No workers found</Alert.Description>
                            </Alert.Root>
                        </Table.Cell>
                    </Table.Row>
                )}
                {loading || error || empty ? null : children}
            </Table.Body>
        </Table.Root>
    );
};

export const AdminWorkerTableRow: FC<{ data: ApiGetWorker }> = ({ data }) => {
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={4}>
                    <Alert.Root variant="subtle" status="error">
                        <Alert.Title>Error</Alert.Title>
                        <Alert.Description>{error}</Alert.Description>
                    </Alert.Root>
                </Table.Cell>
            </Table.Row>
        );
    }

    return (
        <Table.Row key={data.id} color={data.active ? 'inherit' : 'fg.error'}>
            <Table.Cell>{data.id}</Table.Cell>
            <Table.Cell>{data.lastname + ' ' + data.name}</Table.Cell>
            <Table.Cell>{data.email}</Table.Cell>
            <Table.Cell textAlign="end">
                <Switch.Root
                    disabled={disabled}
                    defaultChecked={data.show}
                    onCheckedChange={(checked) => {
                        setDisabled(true);
                        updateApiWorker(data.id, { show: checked.checked })
                            .then(() => {
                                setDisabled(false);
                            })
                            .catch((err) => {
                                setError(err.message);
                                setDisabled(false);
                            });
                    }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                </Switch.Root>
            </Table.Cell>
        </Table.Row>
    );
};
