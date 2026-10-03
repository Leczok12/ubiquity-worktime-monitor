import { UbiquitiAccessSystemLog, UbiquitiAccessResponse } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from '@src/types/prisma-transaction';
import { Logger } from '@src/utils/logger';
import { database } from '@src/config/database';

export const syncEvents = async (axiosInstance: AxiosInstance, logger: Logger) => {
    logger.info('Starting events sync');

    const workers = await database.prisma.worker.findMany();

    logger.verbose(`${workers.length} workers to sync events`);

    var workerCount = 0;
    var errorCount = 0;
    for (const worker of workers) {
        workerCount++;

        try {
            await database.prisma.$transaction(
                async (prisma) => {
                    logger.verbose(
                        `[${workerCount}/${workers.length}] Syncing workerId: {${worker.id}}`
                    );
                    const lastEvent = await prisma.event.findFirst({
                        where: { workerId: worker.id },
                        orderBy: {
                            date: 'desc',
                        },
                    });

                    const since = lastEvent ? Math.floor(lastEvent.date.getTime() / 1000) : null;
                    const response = await axiosInstance.post<
                        UbiquitiAccessResponse<UbiquitiAccessSystemLog>
                    >(`/api/v1/developer/system/logs`, {
                        topic: 'door_openings',
                        actor_id: worker.id,
                        since: since,
                    });
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
                },
                { timeout: 60000 }
            );
        } catch (error) {
            errorCount++;
            logger.error(
                `[${workerCount}/${workers.length}] Failed workerId {${worker.id}}: ${
                    error instanceof Error ? error.message : error
                }`
            );
        }
    }
    logger.success(`Finished events sync. ${workerCount} workers processed, ${errorCount} errors.`);
    return { workerCount, errorCount };
};
