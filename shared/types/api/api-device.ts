export const deviceTypes = ['WORK_START_STOP', 'BREAK_START', 'BREAK_STOP', 'UNUSED'] as const;

export type DeviceType = (typeof deviceTypes)[number];
export interface ApiGetDevice {
    id: string;
    name: string;
    type: DeviceType;
}

export interface ApiCreateDevice {
    id?: string;
    name: string;
    type: DeviceType;
}

export interface ApiUpdateDevice {
    name?: string;
    type?: DeviceType;
}
