import { Config } from './config-types';
import dotenv from 'dotenv';

dotenv.config();

export const defaultConfig: Config = {
    UBIQUITI_ACCESS_SYNC_CRON: '*/15 * * * *', // every 15 minutes
    UBIQUITI_ACCESS_FULL_SYNC_CRON: '0 0 * * *', // every day at midnight
    UBIQUITY_ACCESS_SYNC_ON_STARTUP: true,

    UBIQUITI_ACCESS_API_URL: process.env.UBIQUITI_ACCESS_API_URL || '',
    UBIQUITI_ACCESS_API_KEY: process.env.UBIQUITI_ACCESS_API_KEY || '',

    UBIQUITI_ACCESS_END_WORK_DAY: '23:59:00',

    LOGIN_LOCAL_STRATEGY_ENABLED: true,
    LOGIN_MICROSOFT_STRATEGY_ENABLED: false,
    LOGIN_MICROSOFT_LABEL: 'Login with Microsoft',

    SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
};
