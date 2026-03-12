export interface ApiLoginConfigResponse {
    local: {
        enabled: boolean;
    };
    microsoft: {
        label: string;
        enabled: boolean;
    };
}
