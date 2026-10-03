import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: (() => {
            if (process.env.BUILD === 'true') return '';

            const dev = process.env.DEV === 'true';

            if (dev) console.log('DEVELOPMENT MODE');
            else console.log('DEPLOYMENT MODE');

            const user = dev ? process.env.DEV_POSTGRES_USER : process.env.POSTGRES_USER;
            if (user === undefined || user === null || user === '')
                throw new Error(
                    `${dev && 'DEV_'}POSTGRES_USER is not defined in the environment variables`
                );

            const password = dev
                ? process.env.DEV_POSTGRES_PASSWORD
                : process.env.POSTGRES_PASSWORD;
            if (password === undefined || password === null || password === '')
                throw new Error(
                    `${dev && 'DEV_'}POSTGRES_PASSWORD is not defined in the environment variables`
                );

            const host = dev ? process.env.DEV_POSTGRES_HOST : process.env.POSTGRES_HOST;
            if (host === undefined || host === null || host === '')
                throw new Error(
                    `${dev && 'DEV_'}POSTGRES_HOST is not defined in the environment variables`
                );

            const port = dev ? process.env.DEV_POSTGRES_PORT : process.env.POSTGRES_PORT;
            if (port === undefined || port === null || port === '')
                throw new Error(
                    `${dev && 'DEV_'}POSTGRES_PORT is not defined in the environment variables`
                );

            const dbName = dev ? process.env.DEV_POSTGRES_DB : process.env.POSTGRES_DB;
            if (dbName === undefined || dbName === null || dbName === '')
                throw new Error(
                    `${dev && 'DEV_'}POSTGRES_DB is not defined in the environment variables`
                );

            return `postgresql://${user}:${password}@${host}:${port}/${dbName}`;
        })(),
    },
});
