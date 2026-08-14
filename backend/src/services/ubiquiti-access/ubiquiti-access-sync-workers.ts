import { UbiquitiAccessResponse, UbiquitiAccessUser } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { isDeepStrictEqual } from 'node:util';
import { PrismaTransaction } from '@src/types/prisma-transaction';
import { logger } from '@shared/utils/logger';

export const syncWorkers = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting workers sync with Ubiquiti Access API');
    const response =
        await axiosInstance.get<UbiquitiAccessResponse<UbiquitiAccessUser[]>>(
            `/api/v1/developer/users`
        );

    if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Ubiquiti Access API');
    }

    for (const worker of response.data.data) {
        if (!worker.id) {
            throw new Error(`Invalid worker data from Ubiquiti Access API`);
        }

        const existingWorker = await prisma.worker.findUnique({
            where: { id: worker.id },
        });

        if (!existingWorker) {
            await prisma.worker.create({
                data: {
                    id: worker.id,
                    name: worker.first_name ?? '',
                    email: worker.user_email ?? null,
                    active: worker.status === 'ACTIVE' ? true : false,
                    lastname: worker.last_name ?? '',
                },
            });
            logger.success(`Created worker ${worker.first_name} ${worker.last_name}`);
        } else {
            const updatedWorker = await prisma.worker.update({
                where: { id: worker.id },
                data: {
                    name: worker.first_name ?? '',
                    lastname: worker.last_name ?? '',
                    email: worker.user_email ?? null,
                    active: worker.status === 'ACTIVE' ? true : false,
                },
            });
            if (!isDeepStrictEqual(existingWorker, updatedWorker))
                logger.warn(`Updated worker ${worker.first_name} ${worker.last_name}`);
        }
    }

    const removedWorkers = await prisma.worker.findMany({
        where: {
            NOT: {
                id: {
                    in: response.data.data.map((u) => u.id),
                },
            },
        },
    });

    for (const removedWorker of removedWorkers) {
        await prisma.worker.delete({
            where: { id: removedWorker.id },
        });
        logger.danger(`Deleted worker ${removedWorker.name} ${removedWorker.lastname}`);
    }
    logger.success('Finished workers sync with Ubiquiti Access API');
};
