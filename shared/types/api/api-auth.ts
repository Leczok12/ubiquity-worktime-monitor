export interface ApiAuthConfig {
    microsoft: {
        enabled: boolean;
        loginLabel: string;
    };
    google: {
        enabled: boolean;
        loginLabel: string;
    };
}

export interface ApiAuthUser {
    id: string;
    email: string;
    name: string;
    lastname: string;
    role: 'SYSTEM_ADMIN' | 'MANAGER' | 'VIEWER' | 'WORKER';
    workerId?: string;
}
