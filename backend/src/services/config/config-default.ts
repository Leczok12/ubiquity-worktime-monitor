import { Config } from './config-types';
import dotenv from 'dotenv';

dotenv.config();

export const defaultConfig: Config = {
    UBIQUITI_ACCESS_UPDATE_INTERVAL: 60000,
    UBIQUITI_ACCESS_ON_FAIL_UPDATE_INTERVAL: 600,
    UBIQUITI_ACCESS_API_URL: '',
    UBIQUITI_ACCESS_API_KEY: '',
    SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
    ANOTHER_CONFIG: 'default-value',
};
