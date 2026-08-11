import {
    Alert,
    Box,
    Card,
    DatePicker,
    IconButton,
    Portal,
    Skeleton,
    Table,
    parseDate,
} from '@chakra-ui/react';
import type { ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { useState, type FC, type PropsWithChildren } from 'react';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { Tooltip } from './ui/tooltip';

export const WorkEventsTable: FC<
    PropsWithChildren & { loading?: boolean; error?: string; empty?: boolean }
> = ({ children, loading, error, empty }) => {
    const userLocale = navigator.language || 'en-US';
    const [untilDate, setUntilDate] = useState<Date>(new Date());
    const [sinceDate, setSinceDate] = useState<Date>(
        new Date(untilDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    );

    return (
        <Card.Root w={'100%'}>
            <Card.Header
                m={5}
                p={0}
                display={'grid'}
                gridTemplateColumns={'100%'}
                md={{ gridTemplateColumns: '400px auto' }}
                gap={4}
                justifyContent={'space-between'}
            >
                <DatePicker.Root
                    locale={userLocale}
                    selectionMode="range"
                    openOnClick
                    onValueChange={(e) => {
                        console.log('DatePicker onValueChange', e);
                        const [start, end] = e.value;
                        if (start) setSinceDate(new Date(start.toString()));
                        if (end) setUntilDate(new Date(end.toString()));
                    }}
                    defaultValue={[parseDate(sinceDate), parseDate(untilDate)]}
                >
                    <DatePicker.Control>
                        <DatePicker.Input index={0} />
                        <DatePicker.Input index={1} />
                    </DatePicker.Control>
                    <Portal>
                        <DatePicker.Positioner>
                            <DatePicker.Content>
                                <DatePicker.View view="day">
                                    <DatePicker.Header />
                                    <DatePicker.DayTable />
                                </DatePicker.View>
                                <DatePicker.View view="month">
                                    <DatePicker.Header />
                                    <DatePicker.MonthTable />
                                </DatePicker.View>
                                <DatePicker.View view="year">
                                    <DatePicker.Header />
                                    <DatePicker.YearTable />
                                </DatePicker.View>
                            </DatePicker.Content>
                        </DatePicker.Positioner>
                    </Portal>
                </DatePicker.Root>
                <IconButton
                    aria-label="Calendar"
                    variant="subtle"
                    color="fg.success"
                    colorScheme="primary"
                >
                    <PiMicrosoftExcelLogoFill />
                </IconButton>
            </Card.Header>
            <Card.Body pt={0}>
                <Table.Root interactive cursor="default">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader w="40%" md={{ w: '100px' }}>
                                Date
                            </Table.ColumnHeader>
                            <Table.ColumnHeader w="20%" md={{ w: '80px' }}>
                                Start
                            </Table.ColumnHeader>
                            <Table.ColumnHeader w="20%" md={{ w: '80px' }}>
                                End
                            </Table.ColumnHeader>
                            <Table.ColumnHeader w="20%" md={{ w: '80px' }}>
                                Time
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                w="auto"
                                display="none"
                                textAlign="end"
                                md={{ display: 'table-cell' }}
                            >
                                Visualization
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {(() => {
                            if (error) {
                                return (
                                    <Table.Row>
                                        <Table.Cell colSpan={5}>
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
                                        <Table.Cell colSpan={5}>
                                            <Skeleton>Loading work events...</Skeleton>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }
                            if (empty) {
                                return (
                                    <Table.Row>
                                        <Table.Cell colSpan={5}>
                                            <Alert.Root variant="subtle" status="info">
                                                <Alert.Title>Info</Alert.Title>
                                                <Alert.Description>
                                                    No work events found
                                                </Alert.Description>
                                            </Alert.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }
                            return children;
                        })()}
                    </Table.Body>
                </Table.Root>
            </Card.Body>
        </Card.Root>
    );
};

export const WorkEventsTableRow: FC<{ data: ApiGetWorkEventGrouped }> = ({ data }) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const avgDate = new Date((startDate.getTime() + endDate.getTime()) / 2);

    return (
        <Table.Row onClick={() => console.log('Row clicked', data)} cursor="pointer">
            <Tooltip content={startDate.toLocaleString() + ' - ' + endDate.toLocaleString()}>
                <Table.Cell>{avgDate.toLocaleDateString()}</Table.Cell>
            </Tooltip>
            <Table.Cell>{startDate.toLocaleDateString()}</Table.Cell>
            <Table.Cell>{endDate.toLocaleDateString()}</Table.Cell>
            <Table.Cell>9h</Table.Cell>
            <Table.Cell display="none" md={{ display: 'table-cell' }}>
                Visualization
            </Table.Cell>
        </Table.Row>
    );
};
