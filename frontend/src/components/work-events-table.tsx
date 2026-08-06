import { Card, DatePicker, IconButton, Portal, parseDate } from '@chakra-ui/react';
import { useState, type FC } from 'react';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';

const WorkEventsTable: FC<{ workerId: string }> = ({ workerId }) => {
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
                    defaultValue={[parseDate(sinceDate), parseDate(untilDate)]}
                >
                    <DatePicker.Control>
                        <DatePicker.Input index={0} />
                        <DatePicker.Input index={1} />
                        {/* <DatePicker.IndicatorGroup>
                            <DatePicker.Trigger>
                                <GrCalendar />
                            </DatePicker.Trigger>
                        </DatePicker.IndicatorGroup> */}
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
            <Card.Body>
                <p>Worker ID: {workerId}</p>
            </Card.Body>
        </Card.Root>
    );
};

export default WorkEventsTable;
