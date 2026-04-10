/* API Device Types */
export type ApiAdminDeviceType = 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';

/* API get devices */
export interface ApiAdminGetDeviceResponse {
    id: string;
    name: string;
    type: ApiAdminDeviceType;
}

/* API update devices */
export interface ApiAdminUpdateDeviceRequest {
    data: ApiAdminUpdateDeviceData[];
}
export interface ApiAdminUpdateDeviceData {
    id: string;
    type: ApiAdminDeviceType;
}
