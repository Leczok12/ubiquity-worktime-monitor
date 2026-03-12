export interface Config {
    UBIQUITI_ACCESS_SYNC_CRON: string;
    UBIQUITI_ACCESS_FULL_SYNC_CRON: string;
    UBIQUITY_ACCESS_SYNC_ON_STARTUP: boolean;

    UBIQUITI_ACCESS_API_URL: string;
    UBIQUITI_ACCESS_API_KEY: string;

    UBIQUITI_ACCESS_END_WORK_DAY: string;

    LOGIN_LOCAL_STRATEGY_ENABLED: boolean;
    LOGIN_MICROSOFT_STRATEGY_ENABLED: boolean;
    LOGIN_MICROSOFT_LABEL: string;

    SERVER_PORT: number;
}

export type ConfigKey = keyof Config;
