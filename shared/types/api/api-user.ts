export const roles = ['WORKER', 'VIEWER', 'MANAGER', 'SYSTEM_ADMIN'] as const;

export type RoleType = (typeof roles)[number];

export interface ApiCreateUser {
    email: string;
    name: string;
    lastname: string;
    role: RoleType;
    password: string;
}
