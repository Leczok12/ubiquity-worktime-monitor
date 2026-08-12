import { WorkEvent } from '@prisma/client';

export function calculateWorkTimeInMinutes(
    sinceDate: Date,
    untilDate: Date,
    events: WorkEvent[]
): number {
    const sinceMs = sinceDate.getTime();
    const untilMs = untilDate.getTime();

    interface TimePoint {
        time: number;
        deltaWork: number;
        deltaBreak: number;
    }
    const points: TimePoint[] = [];

    for (const event of events) {
        const startMs = Math.max(event.timeStart.getTime(), sinceMs);
        const endMs = Math.min(event.timeEnd.getTime(), untilMs);

        if (startMs < endMs) {
            if (event.type === 'WORK') {
                points.push({ time: startMs, deltaWork: 1, deltaBreak: 0 });
                points.push({ time: endMs, deltaWork: -1, deltaBreak: 0 });
            } else if (event.type === 'BREAK') {
                points.push({ time: startMs, deltaWork: 0, deltaBreak: 1 });
                points.push({ time: endMs, deltaWork: 0, deltaBreak: -1 });
            }
        }
    }

    points.sort((a, b) => a.time - b.time);

    let totalWorkMs = 0;
    let workDepth = 0;
    let breakDepth = 0;

    let lastTime = points.length > 0 ? points[0].time : 0;

    for (const pt of points) {
        if (workDepth > 0 && breakDepth === 0) {
            totalWorkMs += pt.time - lastTime;
        }

        workDepth += pt.deltaWork;
        breakDepth += pt.deltaBreak;

        lastTime = pt.time;
    }

    return totalWorkMs / 60000;
}
