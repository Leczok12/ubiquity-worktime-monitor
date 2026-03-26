import { AxiosInstance } from 'axios';
import { database } from 'src/config/database';
import { logger } from '../../utils/logger';
import { createAxiosInstance } from './ubiquiti-access-sync-create-axios-instance';
import { syncDevices } from './ubiquiti-access-sync-devices';
import { syncGroups } from './ubiquiti-access-sync-groups';
import { syncGroupsAssignment } from './ubiquiti-access-sync-groups-assigment';
import { syncWorkEvents } from './ubiquiti-access-sync-work-events';
import { syncWorkers } from './ubiquiti-access-sync-workers';
import { syncEvents } from './ubiquiti-access-sync-events';
import nodeCron, { ScheduledTask } from 'node-cron';
import { config } from '../config';
import { CronJob } from 'src/utils/cron-job';
import { hostCheck } from 'src/utils/host-check';
import { jobQueue } from '../job-queue';

class UbiquitiAccessSyncService {
    private fullSyncCronJob: CronJob | null = null;
    private syncCronJob: CronJob | null = null;

    public async initialize(): Promise<void> {
        logger.info('Initializing Ubiquiti Access Sync Service');

        this.fullSyncCronJob = new CronJob(
            'Ubiquiti Access Full Sync',
            await config.getValue('UBIQUITI_ACCESS_FULL_SYNC_CRON'),
            async () => {
                jobQueue.push(this.fullSync.bind(this));
            }
        );

        this.syncCronJob = new CronJob(
            'Ubiquiti Access Sync',
            await config.getValue('UBIQUITI_ACCESS_SYNC_CRON'),
            async () => {
                jobQueue.push(this.sync.bind(this));
            }
        );

        if ((await hostCheck(await config.getValue('UBIQUITI_ACCESS_API_URL'))) === false) {
            logger.error('Ubiquiti Access API is not accessible');
            return;
        } else {
            logger.success('Ubiquiti Access API is accessible');
        }

        if ((await config.getValue('UBIQUITY_ACCESS_SYNC_ON_STARTUP')) === false) return;
        jobQueue.push(this.fullSync.bind(this));
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
            try {
                await this._fullSync(axiosInstance);
            } catch (fullSyncError) {
                logger.error(`Ubiquiti Access sync failed: ${error instanceof Error ? error.message : error}`);
            }
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
