import { Alert, Button, IconButton, Table } from '@chakra-ui/react';
import type { ApiGetWorkEvent } from '@shared/types/api/api-work-event';
import type { FC, PropsWithChildren } from 'react';
import { TbTrash } from 'react-icons/tb';

export const WorkEventsTable: FC<
    PropsWithChildren<{ isEmpty?: boolean; onCreate?: () => void }>
> = ({ isEmpty = false, children }) => {
    return (
        <Table.Root interactive>
            <Table.Header>
                <Table.Row>
                    <Table.Cell w={'1/3'} md={{ w: 'auto' }}>
                        Type
                    </Table.Cell>
                    <Table.Cell w={'1/3'} md={{ w: '22%' }}>
                        Start
                    </Table.Cell>
                    <Table.Cell w={'1/3'} md={{ w: '22%' }}>
                        End
                    </Table.Cell>
                    <Table.Cell w="20%" display={'none'} md={{ display: 'table-cell' }}>
                        Place Start
                    </Table.Cell>
                    <Table.Cell w="20%" display={'none'} md={{ display: 'table-cell' }}>
                        Place End
                    </Table.Cell>
                    <Table.Cell
                        w="10%"
                        textAlign="right"
                        display={'none'}
                        md={{ display: 'table-cell' }}
                    >
                        Actions
                    </Table.Cell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {(() => {
                    if (isEmpty) {
                        return (
                            <Table.Row>
                                <Table.Cell colSpan={5}>
                                    <Alert.Root variant="subtle" status="info">
                                        <Alert.Title>Info</Alert.Title>
                                        <Alert.Description>No events found</Alert.Description>
                                    </Alert.Root>
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                    return children;
                })()}
            </Table.Body>
        </Table.Root>
    );
};

export const WorkEventsTableRow: FC<{ data: ApiGetWorkEvent; onHover: (id?: string) => void }> = ({
    data,
    onHover,
}) => {
    return (
        <Table.Row
            cursor="pointer"
            onMouseEnter={() => onHover(data.id)}
            onMouseLeave={() => onHover(undefined)}
        >
            <Table.Cell>{data.type}</Table.Cell>
            <Table.Cell>{new Date(data.sinceDate).toLocaleString()}</Table.Cell>
            <Table.Cell>{new Date(data.untilDate).toLocaleString()}</Table.Cell>
            <Table.Cell display={'none'} md={{ display: 'table-cell' }}>
                {data.placeStart ?? '---'}
            </Table.Cell>
            <Table.Cell display={'none'} md={{ display: 'table-cell' }}>
                {data.placeEnd ?? '---'}
            </Table.Cell>
            <Table.Cell textAlign="right" display={'none'} md={{ display: 'table-cell' }}>
                <IconButton
                    variant="outline"
                    onClick={() => console.log('Delete event', data.id)}
                    aria-label="Delete event"
                >
                    <TbTrash />
                </IconButton>
            </Table.Cell>
        </Table.Row>
    );
};
