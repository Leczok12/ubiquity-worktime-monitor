import { Config } from './config-types';
import dotenv from 'dotenv';

dotenv.config();

export const defaultConfig: Config = {
    UBIQUITY_ACCESS_SYNC_CRONE: '*/15 * * * *', // every 15 minutes
    UBIQUITY_ACCESS_FULL_SYNC_CRONE: '0 0 * * *', // every day at midnight

    UBIQUITI_ACCESS_FULL_AUTO_UPDATE_ENABLED: true,
    UBIQUITI_ACCESS_API_URL: process.env.UBIQUITI_ACCESS_API_URL || '',
    UBIQUITI_ACCESS_API_KEY: process.env.UBIQUITI_ACCESS_API_KEY || '',
    SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
    UBIQUITY_ACCESS_END_WORK_DAY: '23:59:00',
};
