import { log } from 'src/utils/log';
import configManager from '../config-manager';
import axios from 'axios';
import https from 'https';
import { UbiquityAccessGroup, UbiquityAccessResponse, UbiquityAccessUser } from '@shared/ubiquity/access';
import database from 'src/services/database/database-service';
import { isDeepStrictEqual } from 'util';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { exit } from 'process';
import { createAxiosInstance } from './create-axios-instance';
import { syncWorkers } from './sync-workers';
import { syncGroups } from './sync-groups';

class UbiquityAccessSyncManager {
    async fullSync() {
        log('Beginning full sync with Ubiquity Access', 'INFO');
        try {
            const axiosInstance = await createAxiosInstance();

            await database.prisma.$transaction(
                async (prisma) => {
                    log('Syncing workers with Ubiquity Access', 'INFO');
                    await syncWorkers(prisma, axiosInstance);
                    log('Successfully synced workers with Ubiquity Access', 'SUCCESS');
                    log('Syncing groups with Ubiquity Access', 'INFO');
                    await syncGroups(prisma, axiosInstance);
                    log('Successfully synced groups with Ubiquity Access', 'SUCCESS');
                },
                {
                    timeout: 15 * 60 * 1000,
                }
            );
        } catch (error) {
            log(`Rollback changes, Error: ${error instanceof Error ? error.message : error}`, 'ERROR');
        }
        log('Finished full sync with Ubiquity Access', 'SUCCESS');
    }
}
const ubiquityAccessSyncManager = new UbiquityAccessSyncManager();

export default ubiquityAccessSyncManager;
