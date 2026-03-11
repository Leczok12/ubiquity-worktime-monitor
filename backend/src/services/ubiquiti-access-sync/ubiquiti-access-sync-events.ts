import { UbiquitiAccessSystemLog, UbiquitiAccessResponse } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { logger } from '../../utils/logger';

export const syncEvents = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting events sync with Ubiquiti Access API');
    const workers = await prisma.worker.findMany({ where: { sync: true } });

    const lastEvent = await prisma.event.findFirst({
        orderBy: {
            date: 'desc',
        },
    });

    const since = lastEvent ? Math.floor(lastEvent.date.getTime() / 1000) : null;

    for (const worker of workers) {
        const response = await axiosInstance.post<UbiquitiAccessResponse<UbiquitiAccessSystemLog>>(
            `/api/v1/developer/system/logs`,
            {
                topic: 'door_openings',
                actor_id: worker.id,
                since: since,
            }
        );

        if (!response.data || !response.data.data.hits) {
            throw new Error('Invalid response from Ubiquiti Access API');
        }

        for (const event of response.data.data.hits) {
            const timeStamp = new Date(event['@timestamp']);
            if (timeStamp.getTime() / 1000 === since) continue;

            await prisma.event.create({
                data: {
                    date: timeStamp,
                    deviceId: event._source.target[0].id,
                    workerId: worker.id,
                },
            });
        }
    }
    logger.success('Finished events sync with Ubiquiti Access API');
};
