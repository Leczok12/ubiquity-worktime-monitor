export type UbiquitiAccessResponse<T> = {
    code: 'SUCCESS' | string;
    msg: string;
    data: T;
    pagination?: {
        page_num: number;
        page_size: number;
        total: number;
    };
};
