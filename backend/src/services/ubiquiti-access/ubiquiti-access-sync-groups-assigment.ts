import { UbiquitiAccessResponse, UbiquitiAccessUser } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from '@src/types/prisma-transaction';
import { Logger } from '@src/utils/logger';
import { database } from '@src/config/database';
import { PrismaClient } from '@prisma/client';

export const syncGroupsAssignment = async (axiosInstance: AxiosInstance, logger: Logger) => {
    logger.info('Starting groups assignment sync');

    const grups = await database.prisma.group.findMany();

    logger.verbose(`${grups.length} groups to sync assignment`);

    var groupAssigmentCount = 0;
    var errorCount = 0;

    for (const group of grups) {
        groupAssigmentCount++;
        logger.verbose(`[${groupAssigmentCount}/${grups.length}] Syncing groupId: {${group.id}}`);

        try {
            const response = await axiosInstance.get<UbiquitiAccessResponse<UbiquitiAccessUser[]>>(
                `/api/v1/developer/user_groups/${group.id}/users/all`
            );

            if (!response.data || !response.data.data) {
                throw new Error('Invalid response from Ubiquiti Access API');
            }

            await database.prisma.$executeRaw`DELETE FROM "_WorkerGroups" WHERE "A" = ${group.id}`;

            const workerIds = response.data.data.map((user) => user.id);

            for (const workerId of workerIds) {
                try {
                    await database.prisma.$executeRaw`
                        INSERT INTO "_WorkerGroups" ("A", "B")
                        VALUES (${group.id}, ${workerId})
                    `;
                    logger.verbose(
                        `[${groupAssigmentCount}/${grups.length}] Assigned userId {${workerId}} to groupId {${group.id}}`
                    );
                } catch (error) {
                    errorCount++;
                    logger.error(
                        `[${groupAssigmentCount}/${grups.length}] Failed to assign userId {${workerId}} to groupId {${group.id}}: ${
                            error instanceof Error ? error.message : error
                        }`
                    );
                }
            }
        } catch (error) {
            errorCount++;
            logger.error(
                `[${groupAssigmentCount}/${grups.length}] Failed groupId {${group.id}}: ${
                    error instanceof Error ? error.message : error
                }`
            );
        }
    }

    logger.success(
        `Finished groups assignment sync. Total groups processed: ${groupAssigmentCount}, errors: ${errorCount}`
    );
    return { groupAssigmentCount, errorCount };
};
