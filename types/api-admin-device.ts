export type ApiAdminDeviceType = 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';

export interface ApiAdminGetDeviceResponse {
    id: string;
    name: string;
    type: ApiAdminDeviceType;
}

export interface ApiAdminUpdateDeviceRequest {
    id: string;
    type: ApiAdminDeviceType;
}
