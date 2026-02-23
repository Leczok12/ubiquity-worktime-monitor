import { ApiResponseStatus } from '@shared/api-response';

export class ApiError {
    statusCode: number;
    status: ApiResponseStatus;
    message?: string;
    constructor(statusCode: number, status: ApiResponseStatus = 'ERROR', message?: string) {
        this.message = message;
        this.statusCode = statusCode;
        this.status = status;
    }
}
