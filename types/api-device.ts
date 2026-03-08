export interface ApiDeviceResponse {
    id: string;
    name: string;
    type: 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';
}
