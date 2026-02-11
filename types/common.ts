export interface ApiResponse {
    status: number;
    message: string;
    data?: any;
}

export interface Product {
    id: string;
    name: string;
    price: number;
}
