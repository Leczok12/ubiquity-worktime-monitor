import { type FC, type PropsWithChildren } from 'react';
import { Alert, Skeleton, Table } from '@chakra-ui/react';
import type { ApiGetWorker } from '@shared/types/api/api-worker';

export const WorkerTable: FC<
    PropsWithChildren & { loading?: boolean; error?: string; empty?: boolean }
> = ({ children, loading, error, empty }) => {
    return (
        <Table.Root interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Email</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {loading && (
                    <Table.Row>
                        <Table.Cell colSpan={2}>
                            <Skeleton>Loading</Skeleton>
                        </Table.Cell>
                    </Table.Row>
                )}
                {error && (
                    <Table.Row>
                        <Table.Cell colSpan={2}>
                            <Alert.Root variant="subtle" status="error">
                                <Alert.Title>Error</Alert.Title>
                                <Alert.Description>{error}</Alert.Description>
                            </Alert.Root>
                        </Table.Cell>
                    </Table.Row>
                )}
                {empty && (
                    <Table.Row>
                        <Table.Cell colSpan={2}>
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

export const WorkerTableRow: FC<{ data: ApiGetWorker; onClick: () => void }> = ({
    data,
    onClick,
}) => {
    return (
        <Table.Row
            key={data.id}
            color={data.active ? 'inherit' : 'fg.error'}
            onClick={onClick}
            cursor="pointer"
        >
            <Table.Cell w={'50%'}>{data.lastname + ' ' + data.name}</Table.Cell>
            <Table.Cell w={'50%'}>{data.email}</Table.Cell>
        </Table.Row>
    );
};
