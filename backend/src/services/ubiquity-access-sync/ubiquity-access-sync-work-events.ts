import { UbiquityAccessSystemLog, UbiquityAccessResponse } from './ubiquity-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { logger } from '../logger';
import { database } from '../database';
import { config } from '../config';
import { $Enums } from '@prisma/client';
import { raw } from 'express';

export const syncWorkEvents = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting work events sync with Ubiquity Access API');
    const workers = await prisma.worker.findMany({ where: { sync: true } });

    // const [h, m, s] = (await config.getValue('UBIQUITY_ACCESS_END_WORK_DAY')).split(':').map(Number);
    // const offset = (h * 60 * 60 + m * 60 + s) * 1000;

    for (const worker of workers) {
        if (worker.email !== 'kamil.leczkowski@zsoio.pl') continue;

        const lastEvent = await prisma.workEvent.findFirst({
            where: {
                workerId: worker.id,
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
                AND: [{ workerId: worker.id }, { date: { gt: lastEvent?.timeEnd || new Date(0) } }],
            },
        });

        const eventsByDate: { [date: string]: { date: Date; device: { name: string; type: $Enums.DeviceType } }[] } =
            {};

        rawEvents.forEach((event) => {
            const date = new Date(event.date.getTime() + 0); //OFFSET
            date.setHours(0, 0, 0, 0);

            const dateKey = event.date.toDateString();
        });

        const events: { date: Date; device }[];

        console.log('lastEvent', lastEvent?.timeEnd);
        console.log('rawEvents', rawEvents);
    }
    // const lastEvent = await prisma.workEvent.findFirst({
    //     where: {
    //         workerId: worker.id,
    //     },
    //     orderBy: {
    //         timeEnd: 'desc',
    //     },
    // });
    // console.log('lastEvent', lastEvent?.timeEnd || new Date(0), lastEvent);
    // const events = await prisma.event.findMany({
    //     where: {
    //         AND: [{ workerId: worker.id }, { date: { gt: lastEvent?.timeEnd || new Date(0) } }],
    //     },
    // });

    // for (const event of events) {
    // }

    // logger.info(`Found ${events.length} events for worker ${worker.id}`);
    // }

    //     const lastEvent = await prisma.workEvent.findFirst({
    //         where: {
    //             workerId: worker.id,
    //         },
    //         orderBy: {
    //             timeEnd: 'desc',
    //         },
    //     });

    //     const since = lastEvent ? Math.floor(lastEvent.timeEnd.getTime() / 1000) : null;

    //     const response = await axiosInstance.post<UbiquityAccessResponse<UbiquityAccessSystemLog>>(
    //         `/api/v1/developer/system/logs`,
    //         {
    //             topic: 'door_openings',
    //             actor_id: worker.id,
    //             since: since,
    //         }
    //     );

    //     if (!response.data || !response.data.data) {
    //         throw new Error('Invalid response from Ubiquity Access API');
    //     }

    //     const rawData: { date: Date; events: Date[] }[] = [];

    //     response.data.data.hits.forEach((hit) => {
    //         const date = new Date(hit['@timestamp']);

    //         if (date.getTime() / 1000 === since) return;

    //         const existingDate = rawData.find((d) => d.date.toDateString() === date.toDateString());
    //         if (existingDate) {
    //             existingDate.events.push(date);
    //         } else {
    //             rawData.push({ date, events: [date] });
    //         }
    //     });

    //     rawData.sort((a, b) => a.date.getTime() - b.date.getTime());
    //     rawData.forEach((d) => {
    //         d.events.sort((a, b) => a.getTime() - b.getTime());
    //     });

    //     for (const d of rawData) {
    //         await prisma.workEvent.create({
    //             data: {
    //                 lastModified: new Date(),
    //                 workerId: worker.id,
    //                 type: 'WORK',
    //                 timeStart: d.events[0],
    //                 timeEnd: d.events[d.events.length - 1],
    //             },
    //         });
    //     }
    // }

    logger.success('Finished work events sync with Ubiquity Access API');
};
