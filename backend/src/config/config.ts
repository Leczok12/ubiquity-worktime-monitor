import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.SERVER_PORT || 3005,
    databaseUrl: process.env.DATABASE_URL || '',
    logLevel: process.env.LOG_LEVEL || 'INFO',
};
