export interface ApiDeviceResponse {
    id: string;
    name: string;
    type: 'WORK_START_STOP' | 'WORK_START' | 'WORK_STOP' | 'BREAK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';
}
