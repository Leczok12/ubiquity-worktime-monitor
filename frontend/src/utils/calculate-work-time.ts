import type { ApiWorkEvent } from '@shared/api-work-events';

export const calculateWorkTime = (events: ApiWorkEvent[]): number => {
    const workEvents = events.filter((e) => e.type === 'WORK');
    const breakEvents = events.filter((e) => e.type === 'BREAK');

    if (workEvents.length === 0) return 0;

    const totalWorkSeconds = workEvents.reduce((acc, event) => {
        return acc + Math.floor((new Date(event.timeEnd).getTime() - new Date(event.timeStart).getTime()) / 1000);
    }, 0);

    const overlappingBreakSeconds = breakEvents.reduce((acc, breakEvent) => {
        const breakOverlap = workEvents.reduce((breakAcc, workEvent) => {
            const overlapStart = Math.max(
                new Date(workEvent.timeStart).getTime(),
                new Date(breakEvent.timeStart).getTime()
            );
            const overlapEnd = Math.min(new Date(workEvent.timeEnd).getTime(), new Date(breakEvent.timeEnd).getTime());

            if (overlapStart < overlapEnd) {
                breakAcc += Math.floor((overlapEnd - overlapStart) / 1000);
            }
            return breakAcc;
        }, 0);

        return acc + breakOverlap;
    }, 0);

    return Math.max(0, totalWorkSeconds - overlappingBreakSeconds);
};
