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
        enabled: boolean;
    };
    microsoft: {
        label: string;
        enabled: boolean;
    };
}
