import { UbiquitiAccessResponse, UbiquitiAccessGroup } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { isDeepStrictEqual } from 'node:util';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { logger } from '../../utils/logger';

export const syncGroups = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting groups sync with Ubiquiti Access API');
    const response =
        await axiosInstance.get<UbiquitiAccessResponse<UbiquitiAccessGroup[]>>(`/api/v1/developer/user_groups`);

    if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Ubiquiti Access API');
    }

    for (const group of response.data.data) {
        if (!group.id) {
            throw new Error(`Invalid group data from Ubiquiti Access API`);
        }

        const existingGroup = await prisma.group.findUnique({
            where: { id: group.id },
        });

        if (!existingGroup) {
            await prisma.group.create({
                data: {
                    id: group.id,
                    name: group.name ?? '',
                },
            });
            logger.success(`Created group ${group.name}`);
        } else {
            const updatedGroup = await prisma.group.update({
                where: { id: group.id },
                data: {
                    name: group.name ?? '',
                },
            });
            if (!isDeepStrictEqual(existingGroup, updatedGroup)) logger.warn(`Updated group ${group.name}`);
        }
    }

    const removedGroups = await prisma.group.findMany({
        where: {
            NOT: {
                id: {
                    in: response.data.data.map((u) => u.id),
                },
            },
        },
    });

    for (const removedGroup of removedGroups) {
        await prisma.group.delete({
            where: { id: removedGroup.id },
        });
        logger.danger(`Deleted group ${removedGroup.name}`);
    }
    logger.success('Finished groups sync with Ubiquiti Access API');
};
