import { UbiquitiAccessResponse, UbiquitiAccessGroup } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { isDeepStrictEqual } from 'node:util';
import { PrismaTransaction } from '@src/types/prisma-transaction';
import { Logger } from '@src/utils/logger';
import { ENV } from '@src/config/enviroment';
import { database } from '@src/config/database';

export const syncGroups = async (axiosInstance: AxiosInstance, logger: Logger) => {
    logger.info('Starting groups sync');

    var groupCount = 0;
    var errorCount = 0;

    try {
        const response = await axiosInstance.get<UbiquitiAccessResponse<UbiquitiAccessGroup[]>>(
            `/api/v1/developer/user_groups`
        );

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from Ubiquiti Access API');
        }

        const currentGroups = response.data.data;
        const existingGroups = await database.prisma.group.findMany();

        for (const group of currentGroups) {
            groupCount++;
            logger.verbose(`[${groupCount}/${currentGroups.length}] Syncing group {${group.id}}`);

            if (
                existingGroups.find((g) => g.id === group.id) &&
                existingGroups.find((g) => g.id === group.id)?.name !== group.name
            ) {
                logger.warn(
                    `Updating group {${group.id}} name from ${existingGroups.find((g) => g.id === group.id)?.name} to ${group.name}`
                );
                await database.prisma.group.update({
                    where: { id: group.id },
                    data: {
                        name: group.name ?? '',
                    },
                });
            } else if (!existingGroups.find((g) => g.id === group.id)) {
                await database.prisma.group.create({
                    data: {
                        id: group.id,
                        name: group.name ?? '',
                        show: ENV.UBIQUITI_NEW_GROUP_DEFAULT_SHOW,
                    },
                });
                logger.success(`Created group {${group.id}} - ${group.name}`);
            }
        }

        for (const existingGroup of existingGroups) {
            if (!currentGroups.find((g) => g.id === existingGroup.id)) {
                await database.prisma.group.delete({
                    where: { id: existingGroup.id },
                });
                logger.danger(`Deleted group {${existingGroup.id}} - ${existingGroup.name}`);
            }
        }
    } catch (error) {
        errorCount++;
        logger.error(`Failed to sync groups: ${error instanceof Error ? error.message : error}`);
    }

    logger.success(
        `Finished groups sync. Total groups processed: ${groupCount}, errors: ${errorCount}`
    );
};
