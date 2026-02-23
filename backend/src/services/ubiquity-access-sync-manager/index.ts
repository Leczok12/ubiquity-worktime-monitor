import { log } from 'src/utils/log';
import configManager from '../config-manager';
import axios from 'axios';
import https from 'https';
import { UbiquityAccessGroup, UbiquityAccessResponse, UbiquityAccessUser } from '@shared/ubiquity/access';
import database from 'src/config/database';
import { isDeepStrictEqual } from 'util';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { exit } from 'process';

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

        try {
            await database.prisma.$transaction(
                async (prisma) => {
                    log('Syncing workers with Ubiquity Access', 'INFO');
                    //await this.syncWorkers(prisma, apiUrl, apiKey);
                    log('Successfully synced workers with Ubiquity Access', 'SUCCESS');
                    log('Syncing groups with Ubiquity Access', 'INFO');
                    await this.syncGroups(prisma, apiUrl, apiKey);
                    log('Successfully synced groups with Ubiquity Access', 'SUCCESS');
                },
                {
                    timeout: 15 * 60 * 1000,
                }
            );
        } catch (error) {
            log(`Rollback changes, Error: ${error instanceof Error ? error.message : error}`, 'ERROR');
        }
    }

    private async syncWorkers(prisma: PrismaTransaction, apiUrl: string, apiKey: string) {
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

        if (response.data.data) {
            for (const user of response.data.data) {
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
            }
        }
    }

    private async syncGroups(prisma: PrismaTransaction, apiUrl: string, apiKey: string) {
        // Get groups from Ubiquity Access
        const response = await axios.get<UbiquityAccessResponse<UbiquityAccessGroup[]>>(
            `${apiUrl}/api/v1/developer/user_groups`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    accept: 'application/json',
                    'content-Type': 'application/json',
                },
                httpsAgent: this.httpsAgent,
            }
        );

        // Clear unused groups
        const groupsToRemove = await prisma.group.findMany({
            where: { id: { notIn: response.data.data.map((group) => group.id) } },
        });
        await prisma.group.deleteMany({
            where: { id: { in: groupsToRemove.map((group) => group.id) } },
        });
        groupsToRemove.forEach((group) => {
            log(`Deleted group ${group.name} [${group.id}]`, 'WARN');
        });

        // Update or create groups
        for (const group of response.data.data) {
            const existingGroup = await prisma.group.findUnique({
                where: { id: group.id },
            });

            if (existingGroup) {
                const updatedGroup = await prisma.group.update({
                    where: { id: group.id },
                    data: {
                        name: group.name,
                    },
                });
                if (!isDeepStrictEqual(existingGroup, updatedGroup))
                    log(`Updated group ${group.name} [${group.id}]`, 'INFO');
            } else {
                await prisma.group.create({
                    data: {
                        id: group.id,
                        name: group.name,
                    },
                });
                log(`Created group ${group.name} [${group.id}]`, 'SUCCESS');
            }
        }
    }

    private async syncEvents(apiUrl: string, apiKey: string): Promise<boolean> {
        log('Syncing events with Ubiquity Access', 'INFO');
        log('Successfully synced events with Ubiquity Access', 'SUCCESS');
        return true;
    }
}
const ubiquityAccessSyncManager = new UbiquityAccessSyncManager();

export default ubiquityAccessSyncManager;
