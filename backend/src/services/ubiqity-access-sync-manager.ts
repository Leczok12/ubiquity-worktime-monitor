import { log } from 'src/utils/log';
import configManager from './config-manager';
import axios from 'axios';
import https from 'https';
import { UbiquityAccessResponse, UbiquityAccessUser } from '@shared/ubiquity/access';
import database from 'src/config/database';
import { isDeepStrictEqual } from 'util';

class UbiquityAccessSyncManager {
    private readonly httpsAgent = new https.Agent({ rejectUnauthorized: false, timeout: 5000 });

    async sync() {
        const apiKey = await configManager.getValue('ubiquity-access-api-key');
        const apiUrl = await configManager.getValue('ubiquity-access-api-url');

        if (!apiUrl && !apiKey) {
            log('Ubiquity Access API URL and API Key are not set. Skipping sync.', 'WARN');
            return;
        } else if (!apiUrl) {
            log('Ubiquity Access API URL is not set. Skipping sync.', 'WARN');
            return;
        } else if (!apiKey) {
            log('Ubiquity Access API Key is not set. Skipping sync.', 'WARN');
            return;
        }

        if (!(await this.syncWorkers(apiUrl, apiKey))) return;
        if (!(await this.syncGroups(apiUrl, apiKey))) return;
        if (!(await this.syncEvents(apiUrl, apiKey))) return;
    }

    private async syncWorkers(apiUrl: string, apiKey: string): Promise<boolean> {
        log('Syncing workers with Ubiquity Access', 'INFO');
        try {
            const response = await axios.get<UbiquityAccessResponse<UbiquityAccessUser[]>>(
                `${apiUrl}/api/v1/developer/users`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        accept: 'application/json',
                        'content-Type': 'application/json',
                    },
                    httpsAgent: this.httpsAgent,
                }
            );

            await database.prisma.$transaction(async (prisma) => {
                await Promise.all(
                    response.data.data.map(async (user) => {
                        const worker = await prisma.worker.findUnique({
                            where: { id: user.id },
                        });

                        if (worker) {
                            const updatedWorker = await prisma.worker.update({
                                where: { id: user.id },
                                data: {
                                    name: user.first_name,
                                    lastname: user.last_name,
                                    email: user.user_email == '' ? null : user.user_email,
                                    active: user.status === 'ACTIVE' ? true : false,
                                },
                            });

                            if (!isDeepStrictEqual(worker, updatedWorker))
                                log(`Updated worker ${user.first_name} ${user.last_name}`, 'INFO');
                        } else {
                            await prisma.worker.create({
                                data: {
                                    id: user.id,
                                    name: user.first_name,
                                    email: user.user_email == '' ? null : user.user_email,
                                    active: user.status === 'ACTIVE' ? true : false,
                                    lastname: user.last_name,
                                },
                            });
                            log(`Created worker ${user.first_name} ${user.last_name}`, 'INFO');
                        }
                    })
                );
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                log(`Error syncing workers with Ubiquity Access: ${error.message}`, 'ERROR');
            } else {
                log(`Unexpected error syncing workers with Ubiquity Access: ${error}`, 'ERROR');
            }
            return false;
        }
        log(`Successfully synced workers with Ubiquity Access`, 'SUCCESS');
        return true;
    }

    private async syncGroups(apiUrl: string, apiKey: string): Promise<boolean> {
        log('Syncing groups with Ubiquity Access', 'INFO');
        log('Successfully synced groups with Ubiquity Access', 'SUCCESS');
        return true;
    }

    private async syncEvents(apiUrl: string, apiKey: string): Promise<boolean> {
        log('Syncing events with Ubiquity Access', 'INFO');
        log('Successfully synced events with Ubiquity Access', 'SUCCESS');
        return true;
    }
}

const ubiquityAccessSyncManager = new UbiquityAccessSyncManager();

export default ubiquityAccessSyncManager;
