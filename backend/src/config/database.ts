import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseService {
    public readonly prisma: PrismaClient;

    constructor() {
        const adapter = new PrismaPg({
            connectionString:
                process.env.DEV === 'true'
                    ? process.env.DEV_POSTGRES_URL
                    : process.env.POSTGRES_URL,
        });
        this.prisma = new PrismaClient({ adapter });
    }
}

const database = new DatabaseService();

export { database };
