/* API Device Types */
export type ApiAdminDeviceType = 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';

/* API get device */
export interface ApiAdminGetDeviceResponse {
    id: string;
    name: string;
    type: ApiAdminDeviceType;
}

/* API update device */
export interface ApiAdminUpdateDeviceRequest {
    type: ApiAdminDeviceType;
}
