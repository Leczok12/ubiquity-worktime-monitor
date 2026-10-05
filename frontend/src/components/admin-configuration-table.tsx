import { useState, type FC, type PropsWithChildren } from 'react';
import { Alert, Skeleton, Select, Portal, Table, createListCollection } from '@chakra-ui/react';
import { deviceTypes, type ApiGetDevice, type DeviceType } from '@shared/types/api/api-device';
import { updateApiDevice } from '@src/api/api-device';
import type { ApiConfigElement } from '@shared/types/api/api-config';

export const AdminConfigurationTable: FC<
    PropsWithChildren & { loading?: boolean; error?: string; empty?: boolean }
> = ({ children, loading, error, empty }) => {
    return (
        <Table.Root interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader w="50%">Name</Table.ColumnHeader>
                    <Table.ColumnHeader w="50%">Value</Table.ColumnHeader>
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
                                <Alert.Description>No configuration found</Alert.Description>
                            </Alert.Root>
                        </Table.Cell>
                    </Table.Row>
                )}
                {loading || error || empty ? null : children}
            </Table.Body>
        </Table.Root>
    );
};

export const AdminConfigurationTableRow: FC<{ data: ApiConfigElement }> = ({ data }) => {
    return (
        <Table.Row>
            <Table.Cell>{data.name}</Table.Cell>
            <Table.Cell>{data.value}</Table.Cell>
        </Table.Row>
    );
};
