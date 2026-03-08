export interface Config {
    UBIQUITY_ACCESS_SYNC_CRONE: string;
    UBIQUITY_ACCESS_FULL_SYNC_CRONE: string;

    UBIQUITI_ACCESS_FULL_AUTO_UPDATE_ENABLED: boolean;
    UBIQUITI_ACCESS_API_URL: string;
    UBIQUITI_ACCESS_API_KEY: string;
    UBIQUITY_ACCESS_END_WORK_DAY: string;
    SERVER_PORT: number;
}

export type ConfigKey = keyof Config;
