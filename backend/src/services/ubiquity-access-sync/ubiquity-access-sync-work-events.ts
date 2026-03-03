import { UbiquityAccessSystemLog, UbiquityAccessResponse } from './ubiquity-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { logger } from '../logger';
import { database } from '../database';

export const syncWorkEvents = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting work events sync with Ubiquity Access API');
    const workers = await prisma.worker.findMany({ where: { sync: true } });

    for (const worker of workers) {
        const lastEvent = await prisma.workEvent.findFirst({
            where: {
                workerId: worker.id,
            },
            orderBy: {
                timeEnd: 'desc',
            },
        });

        const since = lastEvent ? Math.floor(lastEvent.timeEnd.getTime() / 1000) : null;

        const response = await axiosInstance.post<UbiquityAccessResponse<UbiquityAccessSystemLog>>(
            `/api/v1/developer/system/logs`,
            {
                topic: 'door_openings',
                actor_id: worker.id,
                since: since,
            }
        );

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from Ubiquity Access API');
        }

        const rawData: { date: Date; events: Date[] }[] = [];

        response.data.data.hits.forEach((hit) => {
            const date = new Date(hit['@timestamp']);

            if (date.getTime() / 1000 === since) return;

            const existingDate = rawData.find((d) => d.date.toDateString() === date.toDateString());
            if (existingDate) {
                existingDate.events.push(date);
            } else {
                rawData.push({ date, events: [date] });
            }
        });

        rawData.sort((a, b) => a.date.getTime() - b.date.getTime());
        rawData.forEach((d) => {
            d.events.sort((a, b) => a.getTime() - b.getTime());
        });

        for (const d of rawData) {
            await prisma.workEvent.create({
                data: {
                    lastModified: new Date(),
                    workerId: worker.id,
                    type: 'WORK',
                    timeStart: d.events[0],
                    timeEnd: d.events[d.events.length - 1],
                },
            });
        }
    }

    logger.success('Finished work events sync with Ubiquity Access API');
};
