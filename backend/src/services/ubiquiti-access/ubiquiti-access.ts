import { Logger } from '@src/utils/logger';
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
    private logger = new Logger('Access API');

    public async chealthCheck(disableLogging?: boolean): Promise<boolean> {
        if (!ENV.UBIQUITI_HOST || !ENV.UBIQUITI_API_KEY) {
            if (!disableLogging) {
                this.logger.warn(
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
                this.logger.success('Ubiquiti Access API is accessible');
            }
            return true;
        } catch (e) {
            if (!disableLogging) {
                this.logger.error(
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
        this.logger.info('Starting full sync with Ubiquiti Access API');

        if ((await this.chealthCheck(true)) === false) {
            this.logger.error('Ubiquiti Access API is not accessible');
            return;
        }

        try {
            const axiosInstance = this.creteAxiosInstance();

            await syncDevices(axiosInstance, this.logger);

            await database.prisma.$transaction(
                async (prisma) => {
                    await syncWorkers(prisma, axiosInstance);
                },
                { timeout: 60000 }
            );
            await syncGroups(axiosInstance, this.logger);
            await syncGroupsAssignment(axiosInstance, this.logger);
            await syncEvents(axiosInstance, this.logger);
            await syncWorkEvents(axiosInstance, this.logger);

            this.logger.success('Finished full sync with Ubiquiti Access API');
        } catch (error) {
            this.logger.error(
                `Ubiquiti Access full sync failed: ${error instanceof Error ? error.message : error}`
            );
        }
    }

    public async partialSync(): Promise<void> {
        this.logger.info('Starting partial sync with Ubiquiti Access API');

        if ((await this.chealthCheck(true)) === false) {
            this.logger.error('Ubiquiti Access API is not accessible');
            return;
        }

        const axiosInstance = this.creteAxiosInstance();
        const syncEventsResult = await syncEvents(axiosInstance, this.logger);
        const syncWorkEventsResult = await syncWorkEvents(axiosInstance, this.logger);

        if (syncEventsResult.errorCount > 0 || syncWorkEventsResult.errorCount > 0) {
            this.logger.warn(
                `Ubiquiti Access partial sync failed. Starting full sync. Errors: ${syncEventsResult.errorCount} events, ${syncWorkEventsResult.errorCount} work events`
            );
            await this.fullSync();
        } else {
            this.logger.success('Finished partial sync with Ubiquiti Access API');
        }
    }
}

const ubiquitiAccess = new UbiquitiAccess();
export { ubiquitiAccess };
