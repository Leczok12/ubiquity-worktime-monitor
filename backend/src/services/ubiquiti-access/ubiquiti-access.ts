import { logger } from '@shared/utils/logger';
import { database } from '@src/config/database';
import { ENV } from '@src/config/enviroment';
import axios from 'axios';
import https from 'https';

import { syncDevices } from './ubiquiti-access-sync-devices';
import { syncWorkers } from './ubiquiti-access-sync-workers';
import { syncGroups } from './ubiquiti-access-sync-groups';
import { syncGroupsAssignment } from './ubiquiti-access-sync-groups-assigment';
import { syncEvents } from './ubiquiti-access-sync-events';
import { syncWorkEvents } from './ubiquiti-access-sync-work-events';

class UbiquitiAccess {
    public async chealthCheck(disableLogging?: boolean): Promise<boolean> {
        if (!ENV.UBIQUITI_HOST || !ENV.UBIQUITI_API_KEY) {
            if (!disableLogging) {
                logger.warn(
                    'UBIQUITI_HOST or UBIQUITI_API_KEY is not defined in environment variables. Sync with Ubiquiti Access API will be disabled. Please set these variables in your .env file and restart the server.'
                );
            }
            return false;
        }

        try {
            await axios({
                url: ENV.UBIQUITI_HOST,
                method: 'GET',
                timeout: 2000,
                validateStatus: () => true,
                httpsAgent: new (require('https').Agent)({
                    rejectUnauthorized: false,
                }),
            });

            if (!disableLogging) {
                logger.success('Ubiquiti Access API is accessible');
            }
            return true;
        } catch (e) {
            if (!disableLogging) {
                logger.error(
                    'Failed to access API. Sync with Ubiquiti Access API will be disabled. Please check the UBIQUITI_HOST and UBIQUITI_API_KEY environment variables and ensure that the API is reachable.'
                );
            }
            return false;
        }
    }

    private creteAxiosInstance(): axios.AxiosInstance {
        return axios.create({
            baseURL: ENV.UBIQUITI_HOST ?? '',
            headers: {
                Authorization: `Bearer ${ENV.UBIQUITI_API_KEY ?? ''}`,
                accept: 'application/json',
                'content-Type': 'application/json',
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false, timeout: 1000 * 5 }),
            timeout: 1000 * 60 * 5,
        });
    }

    public async fullSync(): Promise<void> {
        logger.info('Starting full sync with Ubiquiti Access API');

        if ((await this.chealthCheck(true)) === false) {
            logger.error('Ubiquiti Access API is not accessible');
            return;
        }

        try {
            const axiosInstance = this.creteAxiosInstance();

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

            await database.prisma.$transaction(
                async (prisma) => {
                    await syncEvents(prisma, axiosInstance);
                },
                { timeout: 60000 }
            );

            await database.prisma.$transaction(
                async (prisma) => {
                    await syncWorkEvents(prisma, axiosInstance);
                },
                { timeout: 60000 }
            );

            logger.success('Finished full sync with Ubiquiti Access API');
        } catch (error) {
            logger.error(
                `Ubiquiti Access full sync failed: ${error instanceof Error ? error.message : error}`
            );
        }
    }

    public async partialSync(): Promise<void> {
        logger.info('Starting partial sync with Ubiquiti Access API');

        if ((await this.chealthCheck(true)) === false) {
            logger.error('Ubiquiti Access API is not accessible');
            return;
        }

        try {
            const axiosInstance = this.creteAxiosInstance();

            await database.prisma.$transaction(
                async (prisma) => {
                    await syncEvents(prisma, axiosInstance);
                },
                { timeout: 60000 }
            );

            await database.prisma.$transaction(
                async (prisma) => {
                    await syncWorkEvents(prisma, axiosInstance);
                },
                { timeout: 60000 }
            );

            logger.success('Finished partial sync with Ubiquiti Access API');
        } catch (error) {
            logger.warn(
                `Ubiquiti Access partial sync failed. Starting full sync. Error: ${error instanceof Error ? error.message : error}`
            );
            await this.fullSync();
        }
    }
}

const ubiquitiAccess = new UbiquitiAccess();
export { ubiquitiAccess };
