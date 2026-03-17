export interface ApiAuthUserResponse {
    id: string;
    email: string;
    name: string;
    lastname: string;
    locked: boolean;
    roles: string[];
}

export interface ApiAuthConfigResponse {
    local: {
        label: string;
        enabled: boolean;
    };
    microsoft: {
        label: string;
        enabled: boolean;
    };
}
