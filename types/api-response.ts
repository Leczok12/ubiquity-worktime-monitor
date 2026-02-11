export interface ApiResponse<T> {
    status: ApiResponseStatus;
    message: string;
    data?: T;
    pagination?: {
        page: number;
        totalPages: number;
        pageSize: number;
    };
}

export type ApiResponseStatus = 'SUCCESS' | 'ERROR';
