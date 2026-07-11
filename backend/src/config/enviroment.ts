const DEV = process.env.DEV === 'true';
export const ENV = {
    DEV: DEV,

    APP_PORT: (DEV ? process.env.DEV_BACKEND_PORT : process.env.APP_PORT) ?? 3000,
    APP_URL: (DEV ? process.env.DEV_BACKEND_URL : process.env.APP_URL) ?? 'http://localhost:3000',

    MICROSOFT_ENABLED: process.env.MICROSOFT_ENABLED === 'true',
    MICROSOFT_LOGIN_LABEL: process.env.MICROSOFT_LOGIN_LABEL ?? 'Login with Microsoft',
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID ?? null,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET ?? null,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID ?? null,

    GOOGLE_ENABLED: process.env.GOOGLE_ENABLED === 'true',
    GOOGLE_LOGIN_LABEL: process.env.GOOGLE_LOGIN_LABEL ?? 'Login with Google',
};
