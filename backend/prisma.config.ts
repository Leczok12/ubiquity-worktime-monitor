import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config();

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DEV === 'true' ? process.env.DEV_POSTGRES_URL : process.env.POSTGRES_URL,
    },
});
