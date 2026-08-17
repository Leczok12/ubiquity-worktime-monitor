import { Alert, Box, Button, IconButton, Skeleton, Table } from '@chakra-ui/react';
import type { ApiGetWorkEvent } from '@shared/types/api/api-work-event';
import type { FC, PropsWithChildren } from 'react';
import { TbCopy, TbPlus, TbTrash } from 'react-icons/tb';

export const WorkEventsTable: FC<
    PropsWithChildren<{
        empty?: boolean;
        loading?: boolean;
        error?: string;
        onCreate?: () => void;
        showActions?: boolean;
    }>
> = ({ empty = false, loading = false, error, children, showActions = true }) => {
    return (
        <Table.Root interactive>
            <Table.Header>
                <Table.Row>
                    <Table.Cell w={'1/3'} md={{ w: 'auto' }}>
                        Type
                    </Table.Cell>
                    <Table.Cell w={'1/3'} textAlign={'center'} md={{ w: '22%' }}>
                        Start
                    </Table.Cell>
                    <Table.Cell w={'1/3'} textAlign={'center'} md={{ w: '22%' }}>
                        End
                    </Table.Cell>
                    <Table.Cell
                        w="17%"
                        display={'none'}
                        textAlign={'center'}
                        md={{ display: 'table-cell' }}
                    >
                        Place Start
                    </Table.Cell>
                    <Table.Cell
                        w="17%"
                        display={'none'}
                        textAlign={'center'}
                        md={{ display: 'table-cell' }}
                    >
                        Place End
                    </Table.Cell>
                    <Table.Cell
                        w="auto"
                        textAlign="right"
                        display={'none'}
                        md={{ display: showActions ? 'table-cell' : 'none' }}
                    >
                        Actions
                    </Table.Cell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {(() => {
                    if (error) {
                        return (
                            <Table.Row>
                                <Table.Cell colSpan={6}>
                                    <Alert.Root variant="subtle" status="error">
                                        <Alert.Title>Error</Alert.Title>
                                        <Alert.Description>{error}</Alert.Description>
                                    </Alert.Root>
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                    if (loading) {
                        return (
                            <Table.Row>
                                <Table.Cell colSpan={6}>
                                    <Skeleton>Loading...</Skeleton>
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                    if (empty) {
                        return (
                            <Table.Row>
                                <Table.Cell colSpan={6}>
                                    <Alert.Root variant="subtle" status="info">
                                        <Alert.Title>Info</Alert.Title>
                                        <Alert.Description>No events found</Alert.Description>
                                    </Alert.Root>
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                    return <>{children}</>;
                })()}
            </Table.Body>
        </Table.Root>
    );
};

export const WorkEventsTableRow: FC<{
    data: ApiGetWorkEvent;
    onHover: (id?: string) => void;
    onDelete: (id: string) => void;
    disabled?: boolean;
    showActions?: boolean;
}> = ({ data, onHover, onDelete, disabled, showActions = true }) => {
    return (
        <Table.Row
            cursor="pointer"
            onMouseEnter={() => onHover(data.id)}
            onMouseLeave={() => onHover(undefined)}
        >
            <Table.Cell>{data.type}</Table.Cell>
            <Table.Cell textAlign={'center'}>
                {new Date(data.sinceDate).toLocaleString()}
            </Table.Cell>
            <Table.Cell textAlign={'center'}>
                {new Date(data.untilDate).toLocaleString()}
            </Table.Cell>
            <Table.Cell textAlign={'center'} display={'none'} md={{ display: 'table-cell' }}>
                {data.placeStart ?? '---'}
            </Table.Cell>
            <Table.Cell textAlign={'center'} display={'none'} md={{ display: 'table-cell' }}>
                {data.placeEnd ?? '---'}
            </Table.Cell>
            <Table.Cell
                textAlign="right"
                display={'none'}
                md={{ display: showActions ? 'table-cell' : 'none' }}
            >
                <Box display={'flex'} w={'full'} h={'full'} gap={2} justifyContent={'flex-end'}>
                    <IconButton
                        disabled={disabled}
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
                        _hover={{ bg: 'fg.info' }}
                    >
                        <TbCopy />
                    </IconButton>
                    <IconButton
                        disabled={disabled}
                        variant="outline"
                        onClick={() => onDelete(data.id)}
                        _hover={{ bg: 'fg.error' }}
                    >
                        <TbTrash />
                    </IconButton>
                </Box>
            </Table.Cell>
        </Table.Row>
    );
};
