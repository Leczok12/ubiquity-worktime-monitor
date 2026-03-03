import { UbiquityAccessResponse, UbiquityAccessUser } from './ubiquity-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { logger } from '../logger';

export const syncGroupsAssignment = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting groups assignment sync with Ubiquity Access API');

    await prisma.$executeRaw`DELETE FROM "_WorkerGroups"`;

    const groups = await prisma.group.findMany();

    for (const group of groups) {
        logger.info(`Syncing workers assigment for group ${group.name}`);
        const response = await axiosInstance.get<UbiquityAccessResponse<UbiquityAccessUser[]>>(
            `/api/v1/developer/user_groups/${group.id}/users/all`
        );

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from Ubiquity Access API');
        }

        for (const user of response.data.data) {
            await prisma.$executeRaw`
                INSERT INTO "_WorkerGroups" ("A", "B")
                VALUES (${group.id}, ${user.id})
            `;
        }
        logger.success(`Finished workers assignment for group ${group.name}`);
    }

    logger.success('Finished groups assignment sync with Ubiquity Access API');
};
