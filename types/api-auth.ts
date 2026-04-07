export type ApiAuthUserRoles = 'SYSTEM_ADMIN' | 'MANAGER' | 'VIEWER' | 'WORKER';
export interface ApiAuthUserResponse {
    id: string;
    email: string;
    name: string;
    lastname: string;
    locked: boolean;
    role: ApiAuthUserRoles;
}

export interface ApiAuthLoginLocalRequest {
    username: string;
    password: string;
}
export interface ApiAuthChangePasswordRequest {
    password: string;
    passwordConfirm: string;
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
