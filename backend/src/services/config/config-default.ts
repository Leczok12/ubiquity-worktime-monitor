import { Config } from './config-types';
import dotenv from 'dotenv';

dotenv.config();

export const defaultConfig: Config = {
    UBIQUITI_ACCESS_UPDATE_INTERVAL: 1000 * 60 * 60, // 1 hour
    UBIQUITI_ACCESS_FULL_UPDATE_INTERVAL: 1000 * 60 * 60 * 24, // 24 hours
    UBIQUITI_ACCESS_ON_FAIL_UPDATE_INTERVAL: 1000 * 60 * 5, // 5 minutes
    UBIQUITI_ACCESS_FULL_AUTO_UPDATE_ENABLED: true,
    UBIQUITI_ACCESS_API_URL: process.env.UBIQUITI_ACCESS_API_URL || '',
    UBIQUITI_ACCESS_API_KEY: process.env.UBIQUITI_ACCESS_API_KEY || '',
    SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
    UBIQUITY_ACCESS_END_WORK_DAY: '23:59:00',
};
