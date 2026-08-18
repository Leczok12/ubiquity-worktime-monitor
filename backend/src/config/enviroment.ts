const DEV = process.env.DEV === 'true';
export const ENV = {
    DEV: DEV,

    APP_PORT: (DEV ? process.env.DEV_BACKEND_PORT : process.env.APP_PORT) ?? 3000,
    APP_URL: (DEV ? process.env.DEV_BACKEND_URL : process.env.APP_URL) ?? 'http://localhost:3000',
    TZ: process.env.TZ ?? '',
    END_OF_DAY_OFFSET: (() => {
        if (process.env.END_OF_DAY_OFFSET === undefined) return 0;

        const parsed = parseInt(process.env.END_OF_DAY_OFFSET, 10);

        if (parsed < -720 || parsed > 720) return 0;
        return parsed;
    })(),
    DISPLAY_DATE_OFFSET: (() => {
        if (process.env.DISPLAY_DATE_OFFSET === undefined) return 0;
        const parsed = parseInt(process.env.DISPLAY_DATE_OFFSET, 10);

        if (parsed < -720 || parsed > 720) return 0;
        return parsed;
    })(),

    UBIQUITI_FULL_SYNC_CRON: process.env.UBIQUITI_FULL_SYNC_CRON ?? '0 0 * * *',
    UBIQUITI_PARTIAL_SYNC_CRON: process.env.UBIQUITI_PARTIAL_SYNC_CRON ?? '*/15 * * * *',
    UBIQUITI_HOST: process.env.UBIQUITI_HOST ?? null,
    UBIQUITI_API_KEY: process.env.UBIQUITI_API_KEY ?? null,
    UBIQUITI_SYNC_ON_STARTUP: process.env.UBIQUITI_SYNC_ON_STARTUP === 'true',

    MICROSOFT_ENABLED: process.env.MICROSOFT_ENABLED === 'true',
    MICROSOFT_LOGIN_LABEL: process.env.MICROSOFT_LOGIN_LABEL ?? 'Login with Microsoft',
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID ?? null,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET ?? null,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID ?? null,

    GOOGLE_ENABLED: process.env.GOOGLE_ENABLED === 'true',
    GOOGLE_LOGIN_LABEL: process.env.GOOGLE_LOGIN_LABEL ?? 'Login with Google',
};
