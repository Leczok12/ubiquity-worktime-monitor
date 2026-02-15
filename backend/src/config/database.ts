import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './config-old';
import { PrismaClient } from '@prisma/client';
import { log } from 'src/utils/log';
import { exit } from 'node:process';

class Database {
    public readonly prisma: PrismaClient;

    constructor() {
        log('Initializing database connection', 'INFO');
        const adapter = new PrismaPg({ connectionString: config.databaseUrl });
        this.prisma = new PrismaClient({ adapter });
    }
}

const database = new Database();

export default database;
