export interface Config {
    UBIQUITI_ACCESS_SYNC_CRON: string;
    UBIQUITI_ACCESS_FULL_SYNC_CRON: string;
    UBIQUITY_ACCESS_SYNC_ON_STARTUP: boolean;

    UBIQUITI_ACCESS_FULL_AUTO_UPDATE_ENABLED: boolean;
    UBIQUITI_ACCESS_API_URL: string;
    UBIQUITI_ACCESS_API_KEY: string;
    UBIQUITI_ACCESS_END_WORK_DAY: string;
    SERVER_PORT: number;
}

export type ConfigKey = keyof Config;
