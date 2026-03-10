import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseService {
    public readonly prisma: PrismaClient;

    constructor() {
        logger.info('Initializing database connection');
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL || '',
        });
        this.prisma = new PrismaClient({ adapter });
    }
}

const database = new DatabaseService();

export { database };
