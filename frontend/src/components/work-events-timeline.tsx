import { Box, type BoxProps } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import type { ApiGetWorkEvent } from '@shared/types/api/api-work-event';
import { numberPadding } from '@src/utils/number-padding';
import type { FC } from 'react';

const WorkEventsTimeline: FC<
    {
        since: Date;
        until: Date;
        events: ApiGetWorkEvent[];
        selectedEventId?: string;
        showHours?: boolean;
        size?: 'sm' | 'md' | 'lg';
    } & BoxProps
> = ({ since, until, events, selectedEventId, showHours, size = 'sm', ...props }) => {
    const selectedAnimation = keyframes`
        0% { opacity: 0.8; }
        50% { opacity: 0; }
        100% { opacity: 0.8; }
    `;

    const height = size === 'sm' ? '20px' : size === 'md' ? '30px' : '40px';

    return (
        <Box
            w="100%"
            {...props}
            h={height}
            position="relative"
            bg="gray.800"
            borderRadius="md"
            overflow="hidden"
        >
            {events.map((event) => {
                const durationProcentage =
                    (new Date(event.untilDate).getTime() - new Date(event.sinceDate).getTime()) /
                    (until.getTime() - since.getTime());
                const sinceProcentage =
                    (new Date(event.sinceDate).getTime() - since.getTime()) /
                    (until.getTime() - since.getTime());
                console.log(event.type);
                return (
                    <Box
                        key={event.id}
                        w={`${durationProcentage * 100}%`}
                        h="100%"
                        top={0}
                        opacity={0.8}
                        left={`${sinceProcentage * 100}%`}
                        position="absolute"
                        bg={event.type === 'WORK' ? 'fg.success' : 'fg.warning'}
                        transition="all 0.3s"
                        animation={
                            selectedEventId === event.id
                                ? `${selectedAnimation} 1s infinite ease-in-out`
                                : undefined
                        }
                    />
                );
            })}
            <Box
                opacity={showHours ? 1 : 0}
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                transition="all 0.3s"
                _hover={{
                    opacity: 1,
                }}
            >
                {(() => {
                    const hourLines = [];
                    const totalDuration = until.getTime() - since.getTime();

                    const nextHourStart = new Date(since);
                    nextHourStart.setMinutes(0, 0, 0);
                    nextHourStart.setHours(nextHourStart.getHours() + 1);

                    let currentHour = new Date(nextHourStart);
                    let hourIndex = 0;

                    while (currentHour.getTime() <= until.getTime()) {
                        const hourPercentage =
                            ((currentHour.getTime() - since.getTime()) / totalDuration) * 100;

                        const hour = currentHour.getHours();
                        const isMajorHour = [0, 3, 6, 9, 12, 15, 18, 21].includes(hour);

                        hourLines.push(
                            <Box
                                key={`hour-${hourIndex}`}
                                position="absolute"
                                left={`${hourPercentage}%`}
                                top={0}
                                w={isMajorHour ? '2px' : '1px'}
                                h="100%"
                                bg="gray.600"
                                opacity={isMajorHour ? 1 : 0.5}
                                _before={{
                                    content: isMajorHour ? `"${numberPadding(hour, 2)}:00"` : '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `translateX(-50%) translateY(-50%)`,
                                    fontSize: '10px',
                                }}
                            />
                        );

                        currentHour.setHours(currentHour.getHours() + 1);
                        hourIndex++;
                    }

                    return hourLines;
                })()}
            </Box>
        </Box>
    );
};

export default WorkEventsTimeline;
