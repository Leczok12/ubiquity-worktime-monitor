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
import { useContext, useState, type FC, type PropsWithChildren } from 'react';
import { PiMicrosoftExcelLogoFill, PiPlusBold } from 'react-icons/pi';
import { Tooltip } from './ui/tooltip';
import { numberPadding } from '@src/utils/number-padding';
import WorkEventsTimeline from './work-events-timeline';
import { UserContext } from '@src/hooks/use-user-context';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';

export const WorkDayTable: FC<
    PropsWithChildren & {
        onEdit: (data?: ApiGetWorkEventGrouped) => void;
        disabled?: boolean;
        loading?: boolean;
        empty?: boolean;
    }
> = ({ children, empty, onEdit, disabled, loading }) => {
    const userLocale = navigator.language || 'en-US';
    const userContext = useContext(UserContext);
    const workEventsContext = useContext(WorkEventsContext);

    const since = new Date(workEventsContext.dateRange[0]);
    const until = new Date(workEventsContext.dateRange[1]);

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
                    disabled={disabled}
                    onValueChange={(e) => {
                        if (e.value.length === 2) {
                            workEventsContext.changeDateRange([
                                new Date(e.value[0].toString()),
                                new Date(e.value[1].toString()),
                            ]);
                        }
                    }}
                    defaultValue={[parseDate(since), parseDate(until)]}
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
                <Box display={'flex'} gap={2} justifyContent={'flex-end'} alignItems={'center'}>
                    {userContext &&
                    (userContext.role === 'SYSTEM_ADMIN' || userContext.role === 'MANAGER') ? (
                        <IconButton
                            variant="subtle"
                            color="fg.success"
                            disabled={disabled}
                            onClick={() => onEdit(undefined)}
                        >
                            <PiPlusBold />
                        </IconButton>
                    ) : null}
                    <IconButton variant="subtle" color="fg.success" disabled>
                        {/* //TODO: Implement export to excel */}
                        <PiMicrosoftExcelLogoFill />
                    </IconButton>
                </Box>
            </Card.Header>
            <Card.Body pt={0}>
                <Table.Root interactive cursor="default">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader w="50%" md={{ w: '130px' }}>
                                Date
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                w="50%"
                                textAlign="end"
                                md={{ w: '130px', textAlign: 'center' }}
                            >
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
                            // if (error) {
                            //     return (
                            //         <Table.Row>
                            //             <Table.Cell colSpan={3}>
                            //                 <Alert.Root variant="subtle" status="error">
                            //                     <Alert.Title>Error</Alert.Title>
                            //                     <Alert.Description>{error}</Alert.Description>
                            //                 </Alert.Root>
                            //             </Table.Cell>
                            //         </Table.Row>
                            //     );
                            // }
                            // if (loading) {
                            //     return (
                            //         <Table.Row>
                            //             <Table.Cell colSpan={3}>
                            //                 <Skeleton>Loading work events...</Skeleton>
                            //             </Table.Cell>
                            //         </Table.Row>
                            //     );
                            // }
                            if (empty) {
                                return (
                                    <Table.Row>
                                        <Table.Cell colSpan={3}>
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

export const WorkDayTableRow: FC<{ data: ApiGetWorkEventGrouped; onClick: () => void }> = ({
    data,
    onClick,
}) => {
    const sinceDate = new Date(data.sinceDate);
    const untilDate = new Date(data.untilDate);
    const avgDate = new Date((sinceDate.getTime() + untilDate.getTime()) / 2);

    return (
        <Table.Row onClick={onClick} cursor="pointer">
            <Tooltip content={sinceDate.toLocaleString() + ' - ' + untilDate.toLocaleString()}>
                <Table.Cell>{avgDate.toLocaleDateString()}</Table.Cell>
            </Tooltip>
            <Table.Cell
                textAlign="end"
                md={{ textAlign: 'center' }}
                color={data.time > 0 ? 'fg.success' : undefined}
            >
                {numberPadding(Math.floor(data.time / 60), 2)}:
                {numberPadding(Math.floor(data.time % 60), 2)} h
            </Table.Cell>
            <Table.Cell display="none" textAlign="end" md={{ display: 'table-cell' }}>
                <WorkEventsTimeline since={sinceDate} until={untilDate} events={data.workEvents} />
            </Table.Cell>
        </Table.Row>
    );
};
