export interface ApiResponse<T> {
    status: ApiResponseStatus;
    errorMessage?: string;
    data?: T;
    pagination?: {
        page: number;
        total: number;
        pageSize: number;
    };
}

export type ApiResponseStatus = 'SUCCESS' | 'ERROR' | 'INVALID_ARGS' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN';
