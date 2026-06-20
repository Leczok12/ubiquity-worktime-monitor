export type DeviceType = 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';

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
