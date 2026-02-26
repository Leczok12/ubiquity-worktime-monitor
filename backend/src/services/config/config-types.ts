export interface Config {
    UBIQUITI_ACCESS_UPDATE_INTERVAL: number;
    UBIQUITI_ACCESS_ON_FAIL_UPDATE_INTERVAL: number;
    UBIQUITI_ACCESS_API_URL: string;
    UBIQUITI_ACCESS_API_KEY: string;
    ANOTHER_CONFIG: string;
    SERVER_PORT: number;
}

export type ConfigKey = keyof Config;
