import { AxiosInstance } from 'axios';
import { database } from '../database';
import { logger } from '../logger';
import { createAxiosInstance } from './ubiquiti-access-sync-create-axios-instance';
import { syncDevices } from './ubiquiti-access-sync-devices';
import { syncGroups } from './ubiquiti-access-sync-groups';
import { syncGroupsAssignment } from './ubiquiti-access-sync-groups-assigment';
import { syncWorkEvents } from './ubiquiti-access-sync-work-events';
import { syncWorkers } from './ubiquiti-access-sync-workers';
import { syncEvents } from './ubiquiti-access-sync-events';
import nodeCron, { ScheduledTask } from 'node-cron';
import { config } from '../config';

class UbiquitiAccessSyncService {
    private intervalId: NodeJS.Timeout | null = null;
    private syncTask: ScheduledTask | null = null;
    private syncTaskString: string = '';
    private fullSyncTask: ScheduledTask | null = null;
    private fullSyncTaskString: string = '';

    public async initialize(): Promise<void> {
        logger.info('Initializing Ubiquiti Access Sync Service');

        await this._upsertTask();
        await this.fullSync();
        //await this._sync(await createAxiosInstance());
    }

    public async fullSync(): Promise<void> {
        logger.info('Starting full sync with Ubiquiti Access API');
        const axiosInstance = await createAxiosInstance();
        try {
            await this._fullSync(axiosInstance);
            logger.success('Finished full sync with Ubiquiti Access API');
        } catch (error) {
            logger.error(`Ubiquiti Access full sync failed: ${error instanceof Error ? error.message : error}`);
        }
    }

    public async sync(): Promise<void> {
        logger.info('Starting sync with Ubiquiti Access API');
        const axiosInstance = await createAxiosInstance();
        try {
            await this._sync(axiosInstance);
            logger.success('Finished sync with Ubiquiti Access API');
        } catch (error) {
            logger.error(`Ubiquiti Access sync failed: ${error instanceof Error ? error.message : error}`);
        }
    }

    private async _upsertTask(): Promise<void> {
        if (
            this.fullSyncTask === null ||
            this.fullSyncTaskString !== (await config.getValue('UBIQUITI_ACCESS_FULL_SYNC_CRONE'))
        ) {
            if (this.fullSyncTask) {
                this.fullSyncTask.destroy();
            }
            this.fullSyncTaskString = await config.getValue('UBIQUITI_ACCESS_FULL_SYNC_CRONE');
            this.fullSyncTask = nodeCron.schedule(this.fullSyncTaskString, async () => {
                await this.fullSync();
            });
        }
        if (this.syncTask === null || this.syncTaskString !== (await config.getValue('UBIQUITI_ACCESS_SYNC_CRONE'))) {
            if (this.syncTask) {
                this.syncTask.destroy();
            }
            this.syncTaskString = await config.getValue('UBIQUITI_ACCESS_SYNC_CRONE');
            this.syncTask = nodeCron.schedule(this.syncTaskString, async () => {
                await this.sync();
            });
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

        await this._sync(axiosInstance);
    }

    private async _sync(axiosInstance: AxiosInstance): Promise<void> {
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

const ubiquitiAccessSync = new UbiquitiAccessSyncService();

export { ubiquitiAccessSync };
