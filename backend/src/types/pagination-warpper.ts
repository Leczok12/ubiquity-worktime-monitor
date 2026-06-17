export type PaginationWrapper<T> = {
    data: T;
    pagination: {
        page: number;
        total: number;
        pageSize: number;
    };
};
