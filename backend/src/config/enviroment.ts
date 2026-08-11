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

    MICROSOFT_ENABLED: process.env.MICROSOFT_ENABLED === 'true',
    MICROSOFT_LOGIN_LABEL: process.env.MICROSOFT_LOGIN_LABEL ?? 'Login with Microsoft',
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID ?? null,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET ?? null,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID ?? null,

    GOOGLE_ENABLED: process.env.GOOGLE_ENABLED === 'true',
    GOOGLE_LOGIN_LABEL: process.env.GOOGLE_LOGIN_LABEL ?? 'Login with Google',
};
