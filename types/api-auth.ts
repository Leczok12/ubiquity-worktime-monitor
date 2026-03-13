export interface ApiAuthUserResponse {
    id: string;
    email: string;
    name: string;
    lastname: string;
    locked: boolean;
    roles: string[];
}

export interface ApiLoginConfigResponse {
    local: {
        enabled: boolean;
    };
    microsoft: {
        label: string;
        enabled: boolean;
    };
}
