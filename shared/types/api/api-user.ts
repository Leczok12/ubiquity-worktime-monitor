export const userRole = ['WORKER', 'VIEWER', 'MANAGER', 'SYSTEM_ADMIN'] as const;

export type UserRoleType = (typeof userRole)[number];

export interface ApiGetUser {
    id: string;
    email: string;
    name: string;
    lastname: string;
    role: UserRoleType;
    lastLogin?: string;
    lastActivity?: string;
}

export interface ApiCreateUser {
    email: string;
    name: string;
    lastname: string;
    role: UserRoleType;
    password: string;
}

export interface ApiUpdateUser {
    role?: UserRoleType;
}
