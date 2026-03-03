import { AxiosInstance } from 'axios';
import { database } from '../database';
import { logger } from '../logger';
import { createAxiosInstance } from './ubiquity-access-sync-create-axios-instance';
import { syncDevices } from './ubiquity-access-sync-devices';
import { syncGroups } from './ubiquity-access-sync-groups';
import { syncGroupsAssignment } from './ubiquity-access-sync-groups-assigment';
import { syncWorkEvents } from './ubiquity-access-sync-work-events';
import { syncWorkers } from './ubiquity-access-sync-workers';
import { syncEvents } from './ubiquity-access-sync-events';

class UbiquityAccessSyncService {
    private intervalId: NodeJS.Timeout | null = null;

    public async initialize(): Promise<void> {
        logger.info('Initializing Ubiquity Access Sync Service');
        // await this.fullSync();
        await this._sync(await createAxiosInstance());
    }

    public async sync(): Promise<void> {}

    public async fullSync(): Promise<void> {
        const axiosInstance = await createAxiosInstance();
        try {
            await this._fullSync(axiosInstance);
            logger.info('Ubiquity Access full sync completed successfully');
        } catch (error) {
            logger.error(`Ubiquity Access full sync failed: ${error instanceof Error ? error.message : error}`);
        }
    }

    private async _fullSync(axiosInstance: AxiosInstance): Promise<void> {
        await database.prisma.$transaction(
            async (prisma) => {
                await syncDevices(prisma, axiosInstance);
            },
            { timeout: 60000 }
        );

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

        await database.prisma.$transaction(
            async (prisma) => {
                await syncGroupsAssignment(prisma, axiosInstance);
            },
            { timeout: 60000 }
        );

        this._sync(axiosInstance);
    }

    private async _sync(axiosInstance: AxiosInstance): Promise<void> {
        // await database.prisma.$transaction(
        //     async (prisma) => {
        //         await syncWorkEvents(prisma, axiosInstance);
        //     },
        //     { timeout: 1000 * 60 * 10 }
        // );
        await database.prisma.$transaction(
            async (prisma) => {
                await syncEvents(prisma, axiosInstance);
            },
            { timeout: 1000 * 60 * 10 }
        );

        await database.prisma.$transaction(
            async (prisma) => {
                await syncWorkEvents(prisma, axiosInstance);
            },
            { timeout: 1000 * 60 * 10 }
        );
    }
}

const ubiquityAccessSync = new UbiquityAccessSyncService();

export { ubiquityAccessSync };
