import { database } from '../database';
import { logger } from '../logger';
import { createAxiosInstance } from './ubiquity-access-sync-create-axios-instance';
import { syncGroups } from './ubiquity-access-sync-groups';
import { syncWorkers } from './ubiquity-access-sync-workers';

class UbiquityAccessSyncService {
    private intervalId: NodeJS.Timeout | null = null;

    public async initialize(): Promise<void> {
        logger.info('Initializing Ubiquity Access Sync Service');
        await this.fullSync();
    }

    public async sync(): Promise<void> {}

    public async fullSync(): Promise<void> {
        const axiosInstance = await createAxiosInstance();

        await database.prisma.$transaction(
            async (prisma) => {
                await syncWorkers(prisma, axiosInstance);
            },
            { timeout: 60000 }
        );

        await database.prisma.$transaction(
            async (prisma) => {
                await syncGroups(prisma, axiosInstance);
            },
            { timeout: 60000 }
        );
    }
}

const ubiquityAccessSync = new UbiquityAccessSyncService();

export { ubiquityAccessSync };
