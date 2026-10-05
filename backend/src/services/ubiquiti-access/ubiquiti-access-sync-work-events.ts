import { UbiquitiAccessSystemLog, UbiquitiAccessResponse } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from '@src/types/prisma-transaction';
import { Logger } from '@src/utils/logger';
import { $Enums } from '@prisma/client';
import { environment as env } from '@src/services/environment';
import { database } from '@src/config/database';

export const syncWorkEvents = async (axiosInstance: AxiosInstance, logger: Logger) => {
    logger.info('Starting work events sync');

    const workers = await database.prisma.worker.findMany();

    logger.verbose(`${workers.length} workers to sync work events`);

    const offset = env.END_OF_DAY_OFFSET * 60 * 1000;
    var workerCount = 0;
    var errorCount = 0;

    for (const worker of workers) {
        workerCount++;
        try {
            await database.prisma.$transaction(async (prisma) => {
                logger.verbose(
                    `[${workerCount}/${workers.length}] Syncing workerId: {${worker.id}}`
                );

                const lastEvent = await prisma.workEvent.findFirst({
                    where: {
                        workerId: worker.id,
                        type: $Enums.WorkEventType.WORK,
                    },
                    orderBy: {
                        timeEnd: 'desc',
                    },
                });

                const rawEvents = await prisma.event.findMany({
                    select: {
                        date: true,
                        device: {
                            select: {
                                name: true,
                                type: true,
                            },
                        },
                    },
                    where: {
                        AND: [
                            { workerId: worker.id },
                            { date: { gt: lastEvent?.timeEnd || new Date(0) } },
                            { device: { type: $Enums.DeviceType.WORK_START_STOP } },
                        ],
                    },
                });

                const eventsGroupedByDate: { date: string; events: typeof rawEvents }[] = [];

                rawEvents.forEach((event) => {
                    const date = new Date(event.date.getTime() - offset);
                    date.setHours(0, 0, 0, 0);
                    eventsGroupedByDate
                        .find((d) => d.date === date.toDateString())
                        ?.events.push(event) ||
                        eventsGroupedByDate.push({ date: date.toDateString(), events: [event] });
                });

                eventsGroupedByDate.sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                eventsGroupedByDate.forEach((d) => {
                    d.events.sort((a, b) => a.date.getTime() - b.date.getTime());
                });

                for (const group of eventsGroupedByDate) {
                    if (
                        lastEvent &&
                        new Date(lastEvent.timeEnd.getTime() - offset).toDateString() === group.date
                    ) {
                        await prisma.workEvent.update({
                            where: {
                                id: lastEvent.id,
                            },
                            data: {
                                timeEnd: group.events[group.events.length - 1].date,
                                placeEnd: group.events[group.events.length - 1].device.name,
                                lastModified: new Date(),
                            },
                        });
                        continue;
                    }
                    await prisma.workEvent.create({
                        data: {
                            workerId: worker.id,
                            lastModified: new Date(),
                            type: $Enums.WorkEventType.WORK,
                            timeStart: group.events[0].date,
                            placeStart: group.events[0].device.name,
                            timeEnd: group.events[group.events.length - 1].date,
                            placeEnd: group.events[group.events.length - 1].device.name,
                        },
                    });
                }
            });
        } catch (error) {
            errorCount++;
            logger.error(
                `[${workerCount}/${workers.length}] Failed workerId {${worker.id}}: ${
                    error instanceof Error ? error.message : error
                }`
            );
        }
    }
    logger.success(
        `Finished work events sync. ${workerCount} workers processed, ${errorCount} errors.`
    );
    return { workerCount, errorCount };
};
