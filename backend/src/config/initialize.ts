import { exit } from 'node:process';
import { log } from '../utils/log';
import { config } from './config';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { url } from 'node:inspector';
import database from './database';

export const initialize = async (): Promise<void> => {
    const prisma = database.prisma;

    try {
        log('Initializing configuration', 'INFO');
        await prisma.$transaction(async (p) => {
            const ubiquityUpdateInterval = await p.configuration.findFirst({
                where: { key: 'ubiquity-update-interval' },
            });
            if (!ubiquityUpdateInterval) {
                await p.configuration.create({
                    data: {
                        key: 'ubiquity-update-interval',
                        value: '60000',
                    },
                });
                log('Created default configuration for [ubiquity-update-interval = 60000]', 'INFO');
            }
        });
    } catch (error) {
        throw error;
    }
};
