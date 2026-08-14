import { UbiquitiAccessSystemLog, UbiquitiAccessResponse } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from '@src/types/prisma-transaction';
import { logger } from '@shared/utils/logger';
import { $Enums } from '@prisma/client';
import { ENV } from '@src/config/enviroment';

export const syncWorkEvents = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting work events sync with Ubiquiti Access API');
    const workers = await prisma.worker.findMany();

    const offset = ENV.END_OF_DAY_OFFSET * 60 * 1000;

    for (const worker of workers) {
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
            eventsGroupedByDate.find((d) => d.date === date.toDateString())?.events.push(event) ||
                eventsGroupedByDate.push({ date: date.toDateString(), events: [event] });
        });

        eventsGroupedByDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

        //TODO: sync breaks events
    }

    logger.success('Finished work events sync with Ubiquiti Access API');
};
