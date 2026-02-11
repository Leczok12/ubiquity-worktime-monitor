import { log } from 'node:console';

export const config = {
    port: process.env.SERVER_PORT || 3005,
    logLevel: process.env.LOG_LEVEL || 'INFO',
};
